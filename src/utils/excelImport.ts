import * as XLSX from 'xlsx';
import type { PlayerProfile } from '../data/playerDatabase';

// Helper to normalize header string
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export interface ParseResult {
  players: PlayerProfile[];
  errors: string[];
  totalRows: number;
}

export function parseExcelOrCsvData(data: ArrayBuffer | Uint8Array): ParseResult {
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { players: [], errors: ['File không chứa trang tính (sheet) nào!'], totalRows: 0 };
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    return { players: [], errors: ['File rỗng hoặc không có dữ liệu hợp lệ!'], totalRows: 0 };
  }

  const players: PlayerProfile[] = [];
  const errors: string[] = [];

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // Row number in Excel (header is row 1)
    
    // Map normalized keys to values
    const normalizedRow: Record<string, unknown> = {};
    for (const key of Object.keys(row)) {
      normalizedRow[normalizeKey(key)] = row[key];
    }

    const getVal = (...possibleKeys: string[]): unknown => {
      for (const k of possibleKeys) {
        const norm = normalizeKey(k);
        if (normalizedRow[norm] !== undefined && normalizedRow[norm] !== '') {
          return normalizedRow[norm];
        }
      }
      return '';
    };

    const name = String(getVal('name', 'ten', 'cauthu', 'tencauthu', 'player', 'fullname') || '').trim();
    if (!name) {
      errors.push(`Dòng ${rowNum}: Thiếu tên cầu thủ, đã bỏ qua.`);
      return;
    }

    const ageRaw = Number(getVal('age', 'tuoi', 'playerage'));
    const age = !isNaN(ageRaw) && ageRaw > 12 && ageRaw < 55 ? ageRaw : 19;

    const club = String(getVal('club', 'clb', 'caulacbo', 'doibong', 'team') || 'Tự do').trim();
    const nationality = String(getVal('nationality', 'quoctich', 'nation', 'quocgia', 'country') || 'Quốc tế').trim();
    
    const posRaw = String(getVal('position', 'vitri', 'pos', 'mainposition') || 'MC').toUpperCase().trim();
    const position = posRaw || 'MC';

    const secondaryRaw = String(getVal('secondarypositions', 'vitriphu', 'secondarypos', 'otherpos') || '');
    const secondaryPositions = secondaryRaw
      ? secondaryRaw.split(/[,/|-]/).map(s => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const paRaw = Number(getVal('pa', 'tiemnang', 'potential', 'potentialability'));
    const pa = !isNaN(paRaw) && paRaw >= 1 && paRaw <= 200 ? paRaw : 170;

    const caRaw = Number(getVal('ca', 'hientai', 'current', 'currentability'));
    const ca = !isNaN(caRaw) && caRaw >= 1 && caRaw <= 200 ? caRaw : Math.max(120, pa - 30);

    const value = String(getVal('value', 'giatri', 'gia', 'marketvalue', 'price') || '€10M - €20M').trim();
    const wage = String(getVal('wage', 'luong', 'salary') || '€25k/tuần').trim();

    const role = String(getVal('role', 'vaitro', 'bestrole', 'loaihinh') || 'Ball Winning / Playmaker').trim();
    const footRaw = String(getVal('foot', 'chan', 'chanthuan', 'preferredfoot') || 'Phải').trim().toLowerCase();
    const foot: 'Trái' | 'Phải' | 'Cả hai' = 
      footRaw.includes('trai') || footRaw === 'left' ? 'Trái' :
      footRaw.includes('hai') || footRaw === 'both' ? 'Cả hai' : 'Phải';

    const tierRaw = String(getVal('tier', 'phanloai', 'nhom', 'category') || '').trim();
    let tier: 'Wonderkid' | 'World Class' | 'Bargain' | 'Hidden Gem' = 'Wonderkid';
    if (tierRaw.toLowerCase().includes('world') || tierRaw.toLowerCase().includes('class')) {
      tier = 'World Class';
    } else if (tierRaw.toLowerCase().includes('bargain') || tierRaw.toLowerCase().includes('hoi')) {
      tier = 'Bargain';
    } else if (tierRaw.toLowerCase().includes('gem') || tierRaw.toLowerCase().includes('ngoc') || tierRaw.toLowerCase().includes('an')) {
      tier = 'Hidden Gem';
    } else {
      tier = 'Wonderkid';
    }

    const scoutReport = String(getVal('scoutreport', 'nhanxet', 'baocao', 'danhgia', 'report', 'notes') || 
      `Cầu thủ đầy tiềm năng được thêm từ cơ sở dữ liệu. Sở hữu bộ chỉ số hứa hẹn và phát triển nhanh trong FM26.`).trim();

    const strengthsRaw = String(getVal('strengths', 'diemmanh', 'strength') || '');
    const strengths = strengthsRaw 
      ? strengthsRaw.split(/[,/|-]/).map(s => s.trim()).filter(Boolean)
      : ['Tốc độ xuất sắc', 'Kỹ thuật cơ bản tốt', 'Tiềm năng phát triển cao'];

    const weaknessesRaw = String(getVal('weaknesses', 'diemyeu', 'weakness') || '');
    const weaknesses = weaknessesRaw
      ? weaknessesRaw.split(/[,/|-]/).map(s => s.trim()).filter(Boolean)
      : ['Cần tích lũy thêm kinh nghiệm thi đấu đỉnh cao'];

    const image = String(getVal('image', 'anh', 'avatar', 'photo') || 
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80').trim();

    // Attributes (1-20)
    const getAttr = (fallback: number, ...keys: string[]): number => {
      const v = Number(getVal(...keys));
      if (!isNaN(v) && v >= 1 && v <= 20) return v;
      return fallback;
    };

    const attributes = {
      pace: getAttr(15, 'pace', 'tocdo', 'speed'),
      acceleration: getAttr(15, 'acceleration', 'tangtoc', 'acc'),
      finishing: getAttr(14, 'finishing', 'dutdiem', 'fin'),
      passing: getAttr(14, 'passing', 'chuyen', 'chuyenbong', 'pas'),
      dribbling: getAttr(15, 'dribbling', 'rebong', 'drib'),
      vision: getAttr(14, 'vision', 'tamnhin', 'vis'),
      composure: getAttr(14, 'composure', 'binhtinh', 'cmp'),
      workRate: getAttr(15, 'workrate', 'tinhthan', 'chamchi', 'wr'),
      stamina: getAttr(14, 'stamina', 'theluc', 'sta'),
      tackling: getAttr(11, 'tackling', 'tranhchap', 'tacbong', 'tck')
    };

    const id = `player-${Date.now()}-${index}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    players.push({
      id,
      name,
      age,
      club,
      nationality,
      position,
      secondaryPositions,
      pa,
      ca,
      value,
      wage,
      image,
      role,
      foot,
      strengths,
      weaknesses,
      scoutReport,
      attributes,
      tier
    });
  });

  return {
    players,
    errors,
    totalRows: rawRows.length
  };
}

// Download Sample Template for user
export function downloadSampleCsvTemplate() {
  const sampleData = [
    {
      'Tên cầu thủ': 'Lamine Yamal',
      'Tuổi': 18,
      'Câu lạc bộ': 'Barcelona',
      'Quốc tịch': 'Tây Ban Nha',
      'Vị trí': 'AMR',
      'Vị trí phụ': 'AML, AMC',
      'PA': 195,
      'CA': 168,
      'Giá trị': '€140M - €180M',
      'Lương': '€180k/tuần',
      'Phân loại': 'Wonderkid',
      'Vai trò': 'Inside Forward',
      'Chân thuận': 'Trái',
      'Tốc độ': 16,
      'Tăng tốc': 17,
      'Dứt điểm': 15,
      'Chuyền bóng': 17,
      'Rê bóng': 18,
      'Tầm nhìn': 18,
      'Bình tĩnh': 16,
      'Chăm chỉ': 14,
      'Thể lực': 14,
      'Tranh chấp': 8,
      'Điểm mạnh': 'Rê bóng ma thuật, Tầm nhìn nhạy bén',
      'Điểm yếu': 'Thể lực ở cuối trận',
      'Nhận xét trinh sát': 'Ngôi sao tương lai sáng giá bậc nhất FM26'
    },
    {
      'Tên cầu thủ': 'Franco Mastantuono',
      'Tuổi': 18,
      'Câu lạc bộ': 'River Plate',
      'Quốc tịch': 'Argentina',
      'Vị trí': 'AMC',
      'Vị trí phụ': 'AMR, MC',
      'PA': 188,
      'CA': 142,
      'Giá trị': '€15M - €25M',
      'Lương': '€20k/tuần',
      'Phân loại': 'Wonderkid',
      'Vai trò': 'Advanced Playmaker',
      'Chân thuận': 'Trái',
      'Tốc độ': 14,
      'Tăng tốc': 15,
      'Dứt điểm': 14,
      'Chuyền bóng': 16,
      'Rê bóng': 16,
      'Tầm nhìn': 17,
      'Bình tĩnh': 15,
      'Chăm chỉ': 14,
      'Thể lực': 13,
      'Tranh chấp': 9,
      'Điểm mạnh': 'Nhãn quan chiến thuật, Đá phạt hàng rào hiểm hóc',
      'Điểm yếu': 'Khả năng tì đè cơ bắp',
      'Nhận xét trinh sát': 'Nhạc trưởng tương lai của bóng đá Argentina trong FM26'
    },
    {
      'Tên cầu thủ': 'Khuất Văn Khang',
      'Tuổi': 22,
      'Câu lạc bộ': 'Thể Công Viettel',
      'Quốc tịch': 'Việt Nam',
      'Vị trí': 'AML',
      'Vị trí phụ': 'AMC, MC',
      'PA': 145,
      'CA': 120,
      'Giá trị': '€500k - €1M',
      'Lương': '€3k/tuần',
      'Phân loại': 'Bargain',
      'Vai trò': 'Inverted Winger',
      'Chân thuận': 'Trái',
      'Tốc độ': 15,
      'Tăng tốc': 15,
      'Dứt điểm': 13,
      'Chuyền bóng': 14,
      'Rê bóng': 14,
      'Tầm nhìn': 14,
      'Bình tĩnh': 13,
      'Chăm chỉ': 16,
      'Thể lực': 15,
      'Tranh chấp': 11,
      'Điểm mạnh': 'Cần cù, Tạt bóng chính xác, Tinh thần chiến đấu cao',
      'Điểm yếu': 'Không chiến',
      'Nhận xét trinh sát': 'Cầu thủ chất lượng cao cho các đội bóng tầm trung châu Á hoặc giải hạng dưới châu Âu.'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  
  // Add UTF-8 BOM so Excel opens Vietnamese characters correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'FM26_Database_Mau_Excel_CSV.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export database to CSV or Excel
export function exportPlayersToFile(players: PlayerProfile[], format: 'csv' | 'xlsx' = 'csv') {
  const exportData = players.map(p => ({
    'ID': p.id,
    'Tên cầu thủ': p.name,
    'Tuổi': p.age,
    'Câu lạc bộ': p.club,
    'Quốc tịch': p.nationality,
    'Vị trí': p.position,
    'Vị trí phụ': (p.secondaryPositions || []).join(', '),
    'PA (Tiềm năng)': p.pa,
    'CA (Hiện tại)': p.ca,
    'Giá trị': p.value,
    'Lương': p.wage,
    'Phân loại': p.tier,
    'Vai trò': p.role,
    'Chân thuận': p.foot,
    'Tốc độ': p.attributes.pace,
    'Tăng tốc': p.attributes.acceleration,
    'Dứt điểm': p.attributes.finishing,
    'Chuyền bóng': p.attributes.passing,
    'Rê bóng': p.attributes.dribbling,
    'Tầm nhìn': p.attributes.vision,
    'Bình tĩnh': p.attributes.composure,
    'Chăm chỉ': p.attributes.workRate,
    'Thể lực': p.attributes.stamina,
    'Tranh chấp': p.attributes.tackling,
    'Điểm mạnh': p.strengths.join(', '),
    'Điểm yếu': p.weaknesses.join(', '),
    'Nhận xét trinh sát': p.scoutReport
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'FM26_Players');

  if (format === 'xlsx') {
    XLSX.writeFile(workbook, `FM26_Database_Export_${Date.now()}.xlsx`);
  } else {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FM26_Database_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

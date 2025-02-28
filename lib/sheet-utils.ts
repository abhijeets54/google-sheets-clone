export function generateEmptySheet(cols: number, rows: number) {
  const sheet = [];
  
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ content: '', style: {} });
    }
    sheet.push(row);
  }
  
  return sheet;
}

export function getCellAddress(col: number, row: number) {
  const colLetter = String.fromCharCode(65 + col);
  return `${colLetter}${row + 1}`;
}

export function parseCellAddress(address: string) {
  const match = address.match(/([A-Z]+)(\d+)/);
  if (!match) return null;
  
  const colStr = match[1];
  const rowStr = match[2];
  
  let colIndex = 0;
  for (let i = 0; i < colStr.length; i++) {
    colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64);
  }
  
  return {
    col: colIndex - 1,
    row: parseInt(rowStr) - 1
  };
}
import { Table } from 'react-bootstrap';

export const MappingTable = ({ title, rows, columns, allowedValuesPerCol, cells, setCells }) => {
  if (!cells.length) {
    return null;
  }
  console.log(cells);
  const handleCellValueChange = (rowIndex, columnIndex, newValue) => {
    const updatedRow = cells[columnIndex].map((colValue, i) => i === rowIndex ? newValue : colValue);
    const updatedCells = cells.map((rowValue, i) => i === columnIndex ? updatedRow : rowValue);
    setCells(updatedCells);
  };

  const renderDropdown = (rowIndex, columnIndex) => {
    // We display an inverted table, so when we access cell value we need to switch row-col indexes
    const selectedValue = cells[columnIndex][rowIndex] || '';
    return (
      <select
        value={selectedValue}
        onChange={(e) =>
          handleCellValueChange(rowIndex, columnIndex, e.target.value)
        }
      >
        <option value="">Select a value</option>
        {allowedValuesPerCol[columnIndex].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div>
      <h2>{title}</h2>
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th></th>
            {columns.map((column, columnIndex) => (
              <th key={columnIndex}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row}</td>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex}>{renderDropdown(rowIndex, columnIndex)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
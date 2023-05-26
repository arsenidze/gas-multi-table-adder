import { Table } from 'react-bootstrap';

export const MappingTable = ({ title, rows, columns, allowedValuesPerCol, cells, setCells }) => {
  if (!cells.length) {
    return null;
  }
  console.log(cells);
  const handleCellValueChange = (rowIndex, columnIndex, newValue) => {
    const updatedRow = cells[rowIndex].map((colValue, i) => i === columnIndex ? newValue : colValue);
    const updatedCells = cells.map((rowValue, i) => i === rowIndex ? updatedRow : rowValue);
    setCells(updatedCells);
  };

  const renderDropdown = (rowIndex, columnIndex) => {
    const selectedValue = cells[rowIndex][columnIndex] || '';
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
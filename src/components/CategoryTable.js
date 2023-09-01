import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { fetchItems ,updatePrice} from '../Services/items';
const CategoryTable = () => {
  const [originalData, setOriginalData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchItems()
      setOriginalData(data)
      setEditedData(data)
    }
    fetchData()
  }, [])

  const resetData = () => {
    setEditedData([...originalData]);
  };
  const saveData = async( ) => {
    const changedPrices = {};

    for (const editedItem of editedData) {
      const originalItem = originalData.find(item => item._id === editedItem._id);
    
      if (originalItem && editedItem.price !== originalItem.price) {
        changedPrices[editedItem._id] = editedItem.price;
      }
    }
    const updatedPriceResp = await updatePrice(changedPrices)
    

  };

  

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        sortType: 'basic',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Name',
        accessor: 'name',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Category',
        accessor: 'category',
        Filter: ({ column }) => {
          const uniqueCategories = Array.from(
            new Set(originalData.map(item => item.category))
          );
      
          return (
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                column.setFilter(e.target.value);
              }}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          );
        },
        disableSortBy: true,
      },
      
      
      {
        Header: 'Label',
        accessor: 'label',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Price',
        accessor: 'price',
        sortType: 'basic',
        disableFilters: true,
        Cell: ({ row }) => {
          const handleBlur = (event) => {
            const updatedData = editedData.map((item, index) =>
              index === row.index ? { ...item, price: parseFloat(event.target.textContent) } : item
            );
            setEditedData(updatedData);
          };
      
          return (
            <div
              contentEditable="true"
              suppressContentEditableWarning={true}
              onBlur={handleBlur}
            >
              {row.original.price}
            </div>
          );
        },
      },
      
      {
        Header: 'Description',
        accessor: 'description',
        disableSortBy: true,
        disableFilters: true
      },
    ],
    [editedData,selectedCategory]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: editedData }, useFilters, useSortBy);

  return (
    <>
      <div>
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                    <div>{column.canFilter ? column?.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="button-group">
        <button className="btns" onClick={saveData}>
          Save
        </button>
        <button className="btns" onClick={resetData}>
          Reset
        </button>
      </div>
    </>
  );
};



export default CategoryTable;
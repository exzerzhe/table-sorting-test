import { users } from './data'
import { useState, useEffect } from 'react'
import './style.css'
import classnames from 'classnames'
function Table() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [currentPage, setCurrentPage] = useState(0)
  const [maxPages, setMaxPages] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState(users)

  const tableButtons = classnames({
    'table-buttons-down': sortConfig.direction === 'ascending',
    'table-buttons': sortConfig.direction === null,
    'table-buttons-up': sortConfig.direction === 'descending',
  })

  useEffect(() => {
    const findResults = [...users].filter(
      (item) =>
        item.first_name.toLowerCase().includes(searchValue) ||
        item.last_name.toLowerCase().includes(searchValue) ||
        item.gender.toLowerCase().includes(searchValue)
    )
    setSearchResults(findResults)
  }, [searchValue, sortConfig])

  const sortItems = () => {
    searchResults.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
    return searchResults
  }
  useEffect(() => {
    setMaxPages(Math.ceil(searchResults.length / 50))
  }, [maxPages, searchResults])

  const previousPage = () => {
    if (currentPage !== 0 && maxPages !== 0) {
      setCurrentPage((prevState) => prevState - 1)
    }
  }
  const nextPage = () => {
    if (currentPage !== maxPages - 1 && maxPages !== 0) {
      setCurrentPage((prevState) => prevState + 1)
    }
  }
  const pagesFill = new Array(maxPages).fill(null)
  const pages = pagesFill.map((item, i) => {
    const paginationButtonsStyle = {
      color: currentPage === i ? '#FF8F00' : 'white',
    }
    return (
      <button
        className="pagination-pages"
        style={paginationButtonsStyle}
        onClick={() => setCurrentPage(i)}
        id={i}
        key={i}
      >
        {i + 1}
      </button>
    )
  })

  const sortDirection = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }
  const handleChange = (event) => {
    setCurrentPage(0)
    setSearchValue(event.target.value.toLowerCase())
  }

  return (
    <div className="container">
      <table className="main-table">
        <caption>
          <div>
            <div className="pagination-container">
              <button className="pagination" onClick={previousPage}>
                previous
              </button>
              <>{pages}</>
              <button className="pagination" onClick={nextPage}>
                next
              </button>
            </div>
            <input
              className="search-input"
              placeholder="Search"
              value={searchValue}
              onChange={handleChange}
              type="text"
            />
          </div>
        </caption>
        <thead>
          <tr>
            <th>
              <button
                className={tableButtons}
                onClick={() => {
                  sortDirection('first_name')
                }}
              >
                <span>First name</span>
              </button>
            </th>
            <th>
              <button
                className={tableButtons}
                onClick={() => {
                  sortDirection('last_name')
                }}
              >
                <span>Last name</span>
              </button>
            </th>
            <th>
              <button
                className={tableButtons}
                onClick={() => {
                  sortDirection('gender')
                }}
              >
                <span>Gender</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length === 0 ? (
            <tr>
              <td></td>
              <td>No results found</td>
            </tr>
          ) : null}
          {sortItems()
            .slice(currentPage * 50, (currentPage + 1) * 50)
            .map((data) => (
              <tr key={data.id}>
                <td>{data.first_name}</td>
                <td>{data.last_name}</td>
                <td>{data.gender}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

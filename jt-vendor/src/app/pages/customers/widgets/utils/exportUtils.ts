import { DisplayCustomer } from '../CustomerTableWidget'

/**
 * Exports customer data to CSV format and triggers download
 * @param customers Array of customer data to export
 */
export const exportCustomersToCSV = (customers: DisplayCustomer[]) => {
  const headers = ['Name', 'Email', 'Location', 'Created Date']
  const rows = customers.map((c) => [c.name, c.email, c.location, c.date])

  const csvString = [
    headers.join(','), // header row
    ...rows.map((r) => r.join(',')), // data rows
  ].join('\n')

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'customers.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
} 
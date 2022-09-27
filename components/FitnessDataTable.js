import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const FitnessDataTable = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (currentUser) {
      const unsub = onSnapshot(query(collection(db, 'records'), where('username', '==', currentUser.username)), collection => {
        setRecords(collection.docs.map(record => record.data()))
      })
    }
  }, [currentUser])

  const columns = [
    { field: 'weight', header: 'Weight' },
    { field: 'bmi', header: 'BMI' },
    { field: 'fatPercentage', header: 'Fat %' },
    { field: 'waterPercentage', header: 'Water %' },
  ]

  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
      />
    )
  })

  return <DataTable value={records}>{dynamicColumns}</DataTable>
}

export default FitnessDataTable

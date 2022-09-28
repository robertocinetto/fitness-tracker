import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const FitnessDataTable = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (currentUser) {
      const unsub = onSnapshot(query(collection(db, 'records'), where('username', '==', currentUser.username)), collection => {
        //since the snapshot doesn't get the id of each doc, ids needs to be collected in another way
        //I had to get ids to be able to delete single docs from the collection

        //get the collection docs
        const recordsCollection = collection.docs

        //build an array of ids from the collection
        let ids = recordsCollection.map(record => record.id)

        //build an array of objects containing the db data
        let recordsData = recordsCollection.map(record => record.data())

        //build an alternative array chaining ids and data
        const _records = recordsData.map((record, i) => {
          return { ...record, id: ids[i] }
        })
        setRecords(_records)
      })
    }
  }, [currentUser])

  const columns = [
    { field: 'recordDate', header: 'Date' },
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

  const actionBodyTemplate = rowData => {
    return (
      <>
        {/* <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        /> */}
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    )
  }

  const confirmDeleteProduct = async rowData => {
    await deleteDoc(doc(db, 'records', rowData.id))
  }

  return (
    <DataTable value={records}>
      {dynamicColumns}
      <Column
        body={actionBodyTemplate}
        exportable={false}
      ></Column>
    </DataTable>
  )
}

export default FitnessDataTable

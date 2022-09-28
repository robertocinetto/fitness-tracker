import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, deleteDoc, doc, orderBy, Timestamp, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'
import { recordsState } from '../atom/recordsAtom'

const FitnessDataTable = ({ demoRecords }) => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [records, setRecords] = useRecoilState(recordsState)

  useEffect(() => {
    if (currentUser) {
      let _records = []
      const unsub = onSnapshot(query(collection(db, 'records'), where('username', '==', currentUser.username)), collection => {
        //since the snapshot doesn't get the id of each doc, ids needs to be collected in another way
        //I had to get ids to be able to delete single docs from the collection

        //get the collection docs
        const recordsCollection = collection.docs

        //build an array of ids from the collection
        let ids = recordsCollection.map(record => record.id)

        //build an array of objects containing the db data
        let recordsData = recordsCollection.map(record => record.data())

        //I still need to understand how to order by date from Firestore so I ordered records manually
        _records = recordsData.sort((a, b) => new Date(a.recordDate.toDate()).getTime() - new Date(b.recordDate.toDate()).getTime())

        //build an alternative array chaining ids and data
        _records = recordsData.map((record, i) => {
          return { ...record, id: ids[i], recordDate: record.recordDate.toDate().toLocaleDateString('it-IT') }
        })
        setRecords(_records)
      })
      // if (_records.length === 0) {
      //   demoRecords.forEach(async record => {
      //     console.log(Timestamp.fromDate(new Date(record.recordDate)))
      //     await addDoc(collection(db, 'records'), {
      //       ...record,
      //       recordDate: Timestamp.fromDate(new Date(record.recordDate)),
      //     })
      //   })

      //   setRecords(demoRecords)
      //   // console.log(demoRecords)
      // }
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
        sortable
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
    <DataTable
      value={records}
      sortField="recordDate"
      sortOrder={-1}
    >
      {dynamicColumns}
      <Column
        body={actionBodyTemplate}
        exportable={false}
      ></Column>
    </DataTable>
  )
}

export default FitnessDataTable

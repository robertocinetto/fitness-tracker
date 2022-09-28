import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { useEffect, useRef, useState } from 'react'
import { collection, onSnapshot, query, where, deleteDoc, doc, orderBy, Timestamp, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'
import { recordsState } from '../atom/recordsAtom'

const FitnessDataTable = ({ demoRecords }) => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [records, setRecords] = useRecoilState(recordsState)
  const toast = useRef(null)

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
          // return { ...record, id: ids[i], recordDate: record.recordDate.toDate().toLocaleDateString('en-US') }
          return { ...record, id: ids[i] }
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
    // { field: 'recordDate', header: 'Date' },
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
    try {
      await deleteDoc(doc(db, 'records', rowData.id))
      showSuccessDeletion()
    } catch (error) {}
  }

  const dateBodyTemplate = rowData => {
    return formatDate(rowData.recordDate)
  }
  const formatDate = value => {
    return value.toDate().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const showSuccessDeletion = () => {
    toast.current.show({ severity: 'info', summary: 'Deleted', detail: 'Entry has been deleted', life: 3000 })
  }

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={records}
        sortField="recordDate"
        sortOrder={-1}
      >
        <Column
          field="recordDate"
          header="Date"
          dataType="date"
          sortable
          body={dateBodyTemplate}
        />
        {dynamicColumns}
        <Column
          body={actionBodyTemplate}
          exportable={false}
        />
      </DataTable>
    </>
  )
}

export default FitnessDataTable

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'

import { useEffect, useRef, useState } from 'react'
import { collection, onSnapshot, query, where, deleteDoc, doc, orderBy, Timestamp, addDoc, updateDoc } from 'firebase/firestore'
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
        // _records = recordsData.sort((a, b) => new Date(a.recordDate.toDate()).getTime() - new Date(b.recordDate.toDate()).getTime())

        //build an alternative array chaining ids and data
        _records = recordsData.map((record, i) => {
          // return { ...record, id: ids[i], recordDate: record.recordDate.toDate().toLocaleDateString('en-US') }
          return {
            ...record,
            id: ids[i],
            bmi: (record.weight / ((currentUser.height * currentUser.height) / 10000)).toFixed(1),
          }
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

  const actionBodyTemplate = rowData => {
    return (
      <>
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
      await deleteDoc(doc(db, 'records', rowData.id)).then(showSuccessDeletion())
    } catch (error) {
      console.log(error)
    }
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

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmed!', detail: 'Your new entry has been added successfully', life: 3000 })
  }

  const numberEditorKg = options => {
    return (
      <InputNumber
        minFractionDigits={1}
        maxFractionDigits={1}
        suffix=" kg"
        value={options.value}
        onChange={e => options.editorCallback(e.value)}
      />
    )
  }

  const numberEditorPercentage = options => {
    return (
      <InputNumber
        minFractionDigits={1}
        maxFractionDigits={1}
        suffix=" %"
        value={options.value}
        onChange={e => options.editorCallback(e.value)}
      />
    )
  }

  const numberEditor = options => {
    return (
      <InputNumber
        minFractionDigits={1}
        maxFractionDigits={1}
        value={options.value}
        onChange={e => options.editorCallback(e.value)}
      />
    )
  }

  const onRowEditComplete = async e => {
    let { newData } = e
    console.log(newData)
    await updateDoc(doc(db, 'records', newData.id), {
      // recordDate,
      weight: newData.weight,
      musclesKg: newData.musclesKg,
      fatPercentage: newData.fatPercentage,
      waterPercentage: newData.waterPercentage,
      classification: newData.classification,
      bones: newData.bones,
      dailyKCal: newData.dailyKCal,
      age: newData.age,
      bellyFat: newData.bellyFat,
    }).then(showSuccess())
  }

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        className="data-table"
        size="small"
        value={records}
        sortField="recordDate"
        sortOrder={-1}
        responsiveLayout="scroll"
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        dataKey="id"
      >
        <Column
          field="recordDate"
          header="Date"
          dataType="date"
          sortable
          body={dateBodyTemplate}
        />
        <Column
          field="weight"
          header="Weight"
          sortable
          editor={options => numberEditorKg(options)}
        />
        <Column
          field="bmi"
          header="BMI"
          sortable
        />
        <Column
          field="fatPercentage"
          header="Fat %"
          sortable
          editor={options => numberEditorPercentage(options)}
        />
        <Column
          field="waterPercentage"
          header="Water %"
          sortable
          editor={options => numberEditorPercentage(options)}
        />
        <Column
          field="musclesKg"
          header="Muscles"
          sortable
          editor={options => numberEditorKg(options)}
        />
        <Column
          field="classification"
          header="CLASS"
          sortable
          editor={options => numberEditor(options)}
        />
        <Column
          field="bones"
          header="Bones"
          sortable
          editor={options => numberEditor(options)}
        />
        <Column
          field="dailyKCal"
          header="Daily KCal"
          sortable
          editor={options => numberEditor(options)}
        />
        <Column
          field="age"
          header="Age eq"
          sortable
          editor={options => numberEditor(options)}
        />
        <Column
          field="bellyFat"
          header="Belly Fat"
          sortable
          editor={options => numberEditor(options)}
        />
        <Column
          rowEditor
          headerStyle={{ width: '10%', minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
        />
      </DataTable>
    </>
  )
}

export default FitnessDataTable

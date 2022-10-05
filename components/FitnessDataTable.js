import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { MultiSelect } from 'primereact/multiselect'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

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
  const [rowToBeDelete, setRowToBeDelete] = useState()

  const columns = [
    { field: 'weight', header: 'Weight', editor: 'kg' },
    { field: 'bmi', header: 'BMI' },
    { field: 'fatPercentage', header: 'Fat %', editor: 'percentage' },
    { field: 'waterPercentage', header: 'Water %', editor: 'percentage' },
    { field: 'musclesKg', header: 'Muscles', editor: 'kg' },
    { field: 'classification', header: 'CLASS', editor: 'int' },
    { field: 'bones', header: 'Bones', editor: 'kg' },
    { field: 'dailyKCal', header: 'Daily KCal', editor: 'int' },
    { field: 'age', header: 'Age Eq', editor: 'int' },
    { field: 'bellyFat', header: 'Belly Fat', editor: 'number' },
  ]
  const [selectedColumns, setSelectedColumns] = useState(columns)

  const columnComponents = selectedColumns.map(col => {
    if (col.editor) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          sortable
          editor={options => selectEditor(col.editor, options)}
        />
      )
    } else {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          sortable
        />
      )
    }
  })

  useEffect(() => {
    console.log('%cTable rendered', 'color:orange')
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

        //build an alternative array chaining ids and data
        _records = recordsData.map((record, i) => {
          return {
            ...record,
            id: ids[i],
            bmi: (record.weight / ((currentUser.height * currentUser.height) / 10000)).toFixed(1),
          }
        })

        _records = _records.slice().sort((a, b) => a.recordDate.seconds - b.recordDate.seconds)

        setRecords(_records)
      })
    }
  }, [currentUser])

  const onColumnToggle = event => {
    let selectedColumns = event.value
    let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field))
    setSelectedColumns(orderedSelectedColumns)
  }

  const header = (
    <div style={{ textAlign: 'left' }}>
      <MultiSelect
        value={selectedColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
        style={{ width: '20em' }}
      />
    </div>
  )

  const actionBodyTemplate = rowData => {
    return (
      <>
        <Button
          icon="pi pi-times"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => confirmRowDelete(rowData)}
        />
      </>
    )
  }

  // const confirmRowDelete = rowData => {
  //   confirmDialog({
  //     message: 'Are you sure you want to delete this entry?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     acceptClassName: 'p-button-danger',
  //     accept: rowData => confirmDeleteProduct(rowData),
  //   })
  // }

  function confirmRowDelete(rowData) {
    setRowToBeDelete(rowData)
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => confirmDeleteProduct(),
    })
  }

  const confirmDeleteProduct = async () => {
    try {
      await deleteDoc(doc(db, 'records', rowToBeDelete.id)).then(showSuccessDeletion())
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

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmed!', detail: 'Your new entry has been added successfully', life: 3000 })
  }

  const selectEditor = (editor, options) => {
    if (editor === 'kg') {
      return (
        <InputNumber
          minFractionDigits={1}
          maxFractionDigits={1}
          suffix=" kg"
          value={options.value}
          onChange={e => options.editorCallback(e.value)}
        />
      )
    } else if (editor === 'percentage') {
      return (
        <InputNumber
          minFractionDigits={1}
          maxFractionDigits={1}
          suffix=" %"
          value={options.value}
          onChange={e => options.editorCallback(e.value)}
        />
      )
    } else if (editor === 'int') {
      return (
        <InputNumber
          // minFractionDigits={1}
          // maxFractionDigits={1}
          value={options.value}
          onChange={e => options.editorCallback(e.value)}
        />
      )
    } else {
      return (
        <InputNumber
          minFractionDigits={1}
          maxFractionDigits={1}
          value={options.value}
          onChange={e => options.editorCallback(e.value)}
        />
      )
    }
  }

  const onRowEditComplete = async e => {
    let { newData } = e
    console.log(newData)
    await updateDoc(doc(db, 'records', newData.id), {
      // recordDate,
      weight: newData.weight,
      fatPercentage: newData.fatPercentage,
      waterPercentage: newData.waterPercentage,
      musclesKg: newData.musclesKg,
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
      <ConfirmDialog />

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
        header={header}
      >
        <Column
          field="recordDate"
          header="Date"
          dataType="date"
          sortable
          body={dateBodyTemplate}
        />
        {columnComponents}
        <Column
          rowEditor
          // headerStyle={{ width: '10%', minWidth: '8rem' }}
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

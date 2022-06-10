import React, { FC, useState } from 'react'
import { Button, ModalDialog, Input, Dropdown, Checkbox, Textarea } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import { cfdi } from './utils/cfdi'
import { countries } from './utils/countries'

import styles from './css/general.css'

interface Props {
  orderId: string,
  monto: number, 
  creationDate: any
}

interface pais {
  value : any
  label : any
}

const postData = async (data2: any) => {
  let data: any = data2;

  const optPais: pais | undefined = countries.find((pais: pais) => {
    if (pais.value == data.pais)
      return pais

    return null
  })

  let valuePais: any = (typeof optPais?.value !== undefined) ?  optPais?.value :  'MEX'

  let labelPais: any  = (typeof optPais?.label !== undefined) ? optPais?.label : 'México'

  if (typeof valuePais !== 'undefined')

    data.pais = `${valuePais}-${labelPais}`
   else
    data.pais = `MEX-México`


  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return await fetch('/api/dataentities/facturas/documents?_schema=facturacionTec', requestOptions)
    .then(response => response.json())
}

const InvoiceButton: FC<Props> = ({ orderId, monto, creationDate }) => {
  const intl = useIntl()
  const [data, setData] = useState({
    // "cuentaDirectorioActivo":
    rfc: '',
    razonSocial: '',
    pais: '',
    correoElectronico: '',
    claveCFDI: '',
    usoCFDI: '',
    clavePedido: orderId,
    extranjero : false,
    fechaPago: creationDate,
    montoPago: monto.toString(),
    numIdFiscal: '',
    description : ''
  })

  const [dataERROR, setDataERROR] = useState({
    // "cuentaDirectorioActivo":
    rfc: { error: false, msg: '' },
    razonSocial: { error: false, msg: '' },
    pais: { error: false, msg: '' },
    correoElectronico: { error: false, msg: '' },
    claveCFDI: { error: false, msg: '' }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    setData(prev => ({ ...prev, pais: '' }))
    setData(prev =>      ({...prev, rfc: ''}))
    setData(prev =>      ({...prev, razonSocial: ''}))
    setData(prev =>      ({...prev, pais: ''}))
    setData(prev =>      ({...prev, correoElectronico: ''}))
    setData(prev =>      ({...prev, claveCFDI: ''}))
    setData(prev =>      ({...prev, usoCFDI: ''}))
    setData(prev =>      ({...prev, clavePedido: orderId}))
    setData(prev =>      ({...prev, extranjero : false}))
    setData(prev =>      ({...prev, fechaPago: creationDate}))
    setData(prev =>      ({...prev, montoPago: monto.toString()}))
    setData(prev =>      ({...prev, numIdFiscal: ''}))
    setData(prev =>      ({...prev, description : ''}))
    setIsModalOpen(() => true)
  }

  const handleConfirmation = async () => {
    let pase: boolean = true;

    const isEMAIL = data.correoElectronico.match(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    ) == null ? false : true

    if (/*!data.correoElectronico && */!isEMAIL){
      pase = false
      return setDataERROR((prev) => ({ ...prev, correoElectronico: { error: true, msg: intl.formatMessage({ id: "store/modal.correoElectronico.error.msg" }) } }))
    }
    if (data.correoElectronico && isEMAIL) setDataERROR((prev) => ({ ...prev, correoElectronico: { error: false, msg: '' } }))

    if (!data.razonSocial) {
      pase = false
      return setDataERROR((prev) => ({ ...prev, razonSocial: { error: true, msg: intl.formatMessage({ id: "store/modal.razonSocial.error.msg" }) } }))
    }
    if (data.razonSocial) {setDataERROR((prev) => ({ ...prev, razonSocial: { error: false, msg: '' } }))

    let rfc: string = data.rfc.toUpperCase()
    let validoRFC: boolean = rfc.match(
      /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/
    ) == null ? false : true

    if (!data.extranjero){
      data.numIdFiscal = ''
      data.pais = ''
    }
    
    if (/*!data.rfc && */!validoRFC && !data.extranjero){ 
      pase = false
      return setDataERROR((prev) => ({ ...prev, rfc: { error: true, msg: intl.formatMessage({ id: "store/modal.rfc.error.msg" }) } }))
    }

    if (data.rfc && validoRFC) setDataERROR((prev) => ({ ...prev, rfc: { error: false, msg: '' } }))

    if (data.extranjero){
      if (!data.pais){ 
        pase = false
        return setDataERROR((prev) => ({ ...prev, pais: { error: true, msg: intl.formatMessage({ id: "store/modal.pais.error.msg" }) } }))
      }
      if (!data.pais){ 
        pase = false
        setDataERROR((prev) => ({ ...prev, pais: { error: false, msg: '' } }))
      }

      //if(!data.numIdFiscal) data.numIdFiscal = (data.numIdFiscal == '') ? 'XEXX010101000' : data.numIdFiscal
      setData(prev => ({ ...prev, rfc: 'XEXX010101000' }))
      data.rfc = 'XEXX010101000'
    }else{
      data.pais = 'MEX-México'
    }

    if (!data.claveCFDI){ 
      pase = false
      return setDataERROR((prev) => ({ ...prev, claveCFDI: { error: true, msg: intl.formatMessage({ id: "store/modal.claveCFDI.error.msg" }) } }))
    }
    
    if (!data.claveCFDI) setDataERROR((prev) => ({ ...prev, claveCFDI: { error: false, msg: '' } }))
    
    console.log('PAIS DATA', data)

    if (pase)
      setLoading(() => true)
      await postData(data)

      setIsModalOpen(() => false)
      setLoading(() => false)
    }
  }

  const handleCancelation = () => {
    setIsModalOpen(() => false)
  }
  const handleRFC = (value: string) => {
    setData(prev => ({ ...prev, rfc: value.toUpperCase() }))
    let rfc: string = value.toUpperCase()
    let validoRFC: boolean = rfc.match(
      /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/
    ) == null ? false : true

    if (validoRFC) setDataERROR((prev) => ({ ...prev, rfc: { error: false, msg: '' } }))
    if (!validoRFC) setDataERROR((prev) => ({ ...prev, rfc: { error: true, msg: intl.formatMessage({ id: "store/modal.rfc.error.msg" }) } }))
  }

  const handleEMAIL = (value: string) => {
    setData(prev => ({ ...prev, correoElectronico: value }))

    const isEMAIL = value.match(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    ) == null ? false : true

    if (!isEMAIL) setDataERROR((prev) => ({ ...prev, correoElectronico: { error: true, msg: intl.formatMessage({ id: "store/modal.correoElectronico.error.msg" }) } }))
    if (isEMAIL) setDataERROR((prev) => ({ ...prev, correoElectronico: { error: false, msg: '' } }))
  }

  const handleClickExtranjero = (event: any) => {
    let checked : boolean  = event.target.checked
    //console.log('Extranjero:', checked, 'datos', data)
    if (!checked){
      setDataERROR((prev) => ({ ...prev, numIdFiscal: { error: false, msg: '' } }))
      setData(prev => ({ ...prev, pais:  ''}))
      setData(prev => ({ ...prev, numIdFiscal:  ''}))
    }else{
      setDataERROR((prev) => ({ ...prev, rfc: { error: false, msg: '' } }))
      setData(prev => ({ ...prev, rfc: ''}))
    }
    setData(prev => ({ ...prev, extranjero: checked }));
  }

  const handleOnChangeComment = (event: any)  =>{
    let value : any = event.target.value
    setData(prev => ({ ...prev, description: value }));
  }

  const handleOnChangeDropDown = (_: any, v:string)  =>{
    if (v) setDataERROR((prev) => ({ ...prev, pais: { error: false, msg: '' } }))
      setData(prev => ({ ...prev, pais: v }))
  }
/*
  <p>
    {intl.formatMessage({ id: "store/modal.disclaimer" })}
  </p>
*/
  return (
    <div className="mt3">
      <Button block variation="secondary" onClick={() => handleOpen()}>
        Solicitar Factura
      </Button>

      <ModalDialog
        responsiveFullScreen
        centered
        loading={loading}
        confirmation={{
          onClick: () => handleConfirmation(),
          label: intl.formatMessage({ id: "store/modal.confirmation.label" }),
          isDangerous: false,
        }}
        cancelation={{
          onClick: () => handleCancelation(),
          label: intl.formatMessage({ id: "store/modal.cancelation.label" }),
        }}
        isOpen={isModalOpen}
        onClose={() => handleCancelation()}
      >
        <div className="">
          <p className="f3 f3-ns fw3 gray">
            {intl.formatMessage({ id: "store/modal.title" }, { orderId })}
          </p>
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 w-50-ns">
              <p className="f3 f1-ns fw3 gray">
                {intl.formatMessage({ id: "store/modal.message" })}
              </p>
            </div>
            <div className="w-100 w-50-ns mv4 pv6-ns pl6-ns">
            <div className="w-100 mv6">
                <Input
                  type="email"
                  required
                  maxLength={100}
                  placeholder={intl.formatMessage({ id: "store/modal.correoElectronico.placeholder" })}
                  size="large"
                  value={data.correoElectronico}
                  error={dataERROR.correoElectronico.error}
                  errorMessage={dataERROR.correoElectronico.msg}
                  onChange={(e: { target: { value: any } }) => {
                    const val = e?.target?.value
                    if (val) setDataERROR((prev) => ({ ...prev, correoElectronico: { error: false, msg: '' } }))
                    handleEMAIL(val)
                  }}
                />
              </div>
              <div className="w-100 mv6">
                <Checkbox
                    checked={data.extranjero}
                    id="extranjero-0"
                    label={intl.formatMessage({id : "store/modal.extranjero.label"})}
                    name="extranjero"
                    onChange={handleClickExtranjero}
                    handleC
                    value="option-0"
                  />
              </div>
              <div className="w-100 mv6">
                <Input
                  required
                  maxLength={100}
                  placeholder={intl.formatMessage({ id: "store/modal.razonSocial.placeholder" })}
                  size="large"
                  value={data.razonSocial}
                  error={dataERROR.razonSocial.error}
                  errorMessage={dataERROR.razonSocial.msg}
                  onChange={(e: any) => {
                    const val = e?.target?.value
                    if (val) setDataERROR((prev) => ({ ...prev, razonSocial: { error: false, msg: '' } }))
                    setData(prev => ({ ...prev, razonSocial: val }))
                  }}
                />
              </div>
              <div className={`w-100 mv6 ${!data.extranjero ? '' : styles.hidden}`}>
                <Input
                  required
                  maxLength={13}
                  placeholder={intl.formatMessage({ id: "store/modal.rfc.placeholder" })}
                  size="large"
                  value={data.rfc}
                  error={dataERROR.rfc.error}
                  errorMessage={dataERROR.rfc.msg}
                  onChange={(e: { target: { value: any } }) => {
                    const val = e?.target?.value
                    if (val) setDataERROR((prev) => ({ ...prev, rfc: { error: false, msg: '' } }))
                    handleRFC(e.target.value)
                  }}
                />
              </div>
              <div className={`w-100 mv6 ${data.extranjero ? '' : styles.hidden}`}>
                <Input
                  id="numIdFiscal"
                  required
                  maxLength={20}
                  defaultValue="XEXX010101000"
                  placeholder={intl.formatMessage({ id: "store/modal.numIdFiscal.placeholder" })}
                  size="large"
                  value={data.numIdFiscal}
                  onChange={(e: any) => {
                    const val = e?.target?.value
                    setData(prev => ({ ...prev, numIdFiscal: val }))
                  }}
                />
              </div>
              <div className={`w-100 mv6 ${data.extranjero ? '' : styles.hidden}`}>
                <Dropdown
                  required
                  id="pais"
                  options={countries}
                  placeholder={intl.formatMessage({ id: "store/modal.pais.placeholder" })}
                  size="large"
                  value={data.pais}
                  error={dataERROR.pais.error}
                  errorMessage={dataERROR.pais.msg}
                  onChange={handleOnChangeDropDown}
                />
              </div>
              <div className="w-100 mv6">
                <Dropdown
                  required
                  placeholder={intl.formatMessage({ id: "store/modal.claveCFDI.placeholder" })}
                  size="large"
                  options={cfdi}
                  value={data.claveCFDI}
                  error={dataERROR.claveCFDI.error}
                  errorMessage={dataERROR.claveCFDI.msg}
                  onChange={(e: any, v: string) => {
                    const label = e?.target?.[e?.target?.selectedIndex]?.text
                    if (label) setDataERROR((prev) => ({ ...prev, claveCFDI: { error: false, msg: '' } }))
                    setData(prev => ({ ...prev, claveCFDI: v, usoCFDI: label }))
                  }}
                />
              </div>
              <div className={`w-100 mv6`}>
              
                <Textarea
                  label={!data.extranjero ? "Captura de Código Postal y Régimen Fiscal" :intl.formatMessage({id : "store/modal.comentarios.label"})}
                  placeholder={!data.extranjero ? "64000; 605 Sueldos y Salarios e Ingresos Asimilados a Salarios":""}
                  defaultValue={data.description}
                  onChange={handleOnChangeComment}
                />
                
              </div>
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  )
}

export default InvoiceButton
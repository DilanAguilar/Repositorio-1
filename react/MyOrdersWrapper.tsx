/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import VerFacturaButton from './VerFacturaButton'
import InvoiceButton from './InvoiceButton'
import useFetch from './utils/useFetch'
import { useEffect, useState } from 'react'

const MyOrdersWrapper = ({ orderId }: any) => {
    const { data, status }: any = useFetch(`/api/oms/user/orders/${orderId}`)
    const medioPago: string = data?.paymentData?.transactions[0].payments[0].paymentSystemName;
    const userProfileId = data?.clientProfileData?.userProfileId
    let creationDate: string = data.creationDate + '';
    const days = Math.round((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 3600 * 24))
    let fecha : string  = creationDate.split('T')[0]
    const daysVisibility = 30

    console.log(status, data, 'STATUUSS DESDE MIS PEDIDOS');

    if (status != 'fetched') return null

    let statusValidos:  string[] = ['approve-payment','payment-approved', 'ready-for-handling','start-handling', 'handling', 'invoice', 'invoiced']

    //console.log('IdPedidoooooo: ', orderId,'Status del pedido: ', data.status, ' - Validación: ', statusValidos.includes(data.status), ' - Condición:',  statusValidos.includes(data.status))
    if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <MyOrdersWrapperChild orderId={orderId} medioPago={medioPago} monto={data.value/100} creationDate={fecha} userProfileId={userProfileId} />

    if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <MyOrdersWrapperChilds orderId={orderId} medioPago={medioPago} monto={data.value/100} creationDate={fecha} userProfileId={userProfileId} />

    return null
}

const MyOrdersWrapperChild = ({ orderId, monto, creationDate, userProfileId, medioPago }: any) => {
    const { data }: any = useFetch(`api/dataentities/CL/search?userId=${userProfileId}&_fields=matricula`)
    console.log('DATAAAAAAAAAAAAA******', data);
    //const perfilAlumno = typeof(data?.[0]?.perfilAlumno) === 'undefined' ? false : (data?.[0]?.perfilAlumno === null ? false : data?.[0]?.perfilAlumno )
    
    const matricula = typeof(data?.[0]?.matricula) === 'undefined' || data?.[0]?.matricula === null || data?.[0]?.matricula === '' ? false : data?.[0]?.matricula
    //console.log('matricula', matricula) 

    if (data?.length > 0){
        if (matricula == false ) 
            return <InvoiceButton orderId={orderId} monto={monto} medioPago={medioPago} creationDate={creationDate}/>
        
            if (matricula !== false ) return  <div>  En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div>
        
           /*  if (matricula == true) return  <div> En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div>  */   
    }
    return null
}




const [correo, setCorreo] = useState("");
const [orderIdd, setOrderId] = useState(0);
const [solicitudesFacturacion, setSolicitudesFacturacion] = useState<[]>([]);
const [idSolicitudFactura, setIdSolicitudFactura] = useState<[]>([]);
const [openModalVerFactura, setOpenModalVerFactura] = useState<boolean>(false);


const MyOrdersWrapperChilds = ({ orderId, monto, creationDate, medioPago }: any) => {

    useEffect(() => {
        getCurrentUserSession();
        getSolicitudesFactura(orderId);
      }, [orderId]);

    const ModalVerFactura = (orderId: string) => {
        setOpenModalVerFactura(!openModalVerFactura);
        getSolicitudFactura(orderId);
        setOrderId(orderIdd);
      };

      async function getCurrentUserSession() {
        await fetch("api/sessions/?items=*", {
          method: "GET",
        })
          .then((resp) => resp.json())
          .then((data) => {
            let correo = data.namespaces.profile.email.value;
            setCorreo(correo);
          });
      }

      async function getSolicitudesFactura(ordenesId:any) {
        const requestOptions = {
          method: "GET",
          headers: {
            "X-VTEX-API-AppKey": "vtexappkey-tecmonterreymxqa-QSBKJG",
            "X-VTEX-API-AppToken":
              "JYKVKTXIRRITWXAQYVXQUYQIGMKPYBJUSICFTZKUMVZPSVMDIHMRXVDKHBOXIHKPINBNUUWYLDDZZBQLZHHQPRXWERXRKNLELKHETZINKNGURELFLDXBATZQQFJCXENX",
          },
        };
        await fetch(
          "api/dataentities/facturacionvtable/search?_fields=clavePedido&_where(cliente=" +
            correo +
            " OR correoElectronico=" +
            correo +
            ")",
          requestOptions
        )
          .then((resp) => resp.json())
          .then((data) => {
            let ordenesIdd = [];
            data.map((i: { clavePedido: any }) => {
              ordenesIdd.push(i.clavePedido);
            });
            setSolicitudesFacturacion(data);
            console.log("SOLICITUDES ENVIADAS===> ", data);
            console.log("SOLICITUDES ENVIADAS EN ORRDENEESS===> ", ordenesId);
          });
      }  

    async function getSolicitudFactura(id: string) {
        const requestOptions = {
          method: "GET",
          headers: {
            "X-VTEX-API-AppKey": "vtexappkey-tecmonterreymxqa-QSBKJG",
            "X-VTEX-API-AppToken":
              "JYKVKTXIRRITWXAQYVXQUYQIGMKPYBJUSICFTZKUMVZPSVMDIHMRXVDKHBOXIHKPINBNUUWYLDDZZBQLZHHQPRXWERXRKNLELKHETZINKNGURELFLDXBATZQQFJCXENX",
            Accept: "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json",
            Range: "0-99",
          },
        };
        await fetch(
          "api/dataentities/facturacionvtable/search?_fields=_all&_schema=schemafacturacion&clavePedido=" +
            id,
          requestOptions
        )
          .then((resp) => resp.json())
          .then((data) => {
            setIdSolicitudFactura(data);
            console.log("SOLICITUD DE FACTURA ENVIADAS===> ", data);
          });
      }


    
   /*  const { data }: any = useFetch(`api/dataentities/facturacionvtable/search?userId=${userProfileId}&_fields=idCliente`) */
  /*   console.log('DATA DESDE MY ORDERSWRAPPER*****', data); */
    //const perfilAlumno = typeof(data?.[0]?.perfilAlumno) === 'undefined' ? false : (data?.[0]?.perfilAlumno === null ? false : data?.[0]?.perfilAlumno )
    
    /* const idCliente = typeof(data?.[0]?.idCliente) === 'undefined' || data?.[0]?.idCliente === null || data?.[0]?.idCliente === '' ? false : data?.[0]?.idCliente */
    //console.log('idCliente', idCliente) 

    if (idSolicitudFactura?.length > 0){
        if (solicitudesFacturacion.length > 0) 
            return <VerFacturaButton orderId={orderId} monto={monto} medioPago={medioPago} creationDate={creationDate} detalle={idSolicitudFactura} openModalVerFactura={openModalVerFactura}
            ModalVerFactura={(orderId: string) => ModalVerFactura(orderId)}/>
        
          /*   if (idCliente !== false ) return  <div>  En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div> */
        
           /*  if (idCliente == true) return  <div> En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div>  */   
    }
    return null
}

export default MyOrdersWrapper



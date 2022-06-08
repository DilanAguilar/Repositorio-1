/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, Fragment } from 'react'
import { Button, Input, Textarea, Modal } from 'vtex.styleguide'



const InvoiceButton = (props: any) => {
    console.log("DETALLES DE SOLICITUD", props?.detalle[0]?.correoElectronico);
    const [, setSolicitud] = useState("");
    useEffect(() => {
      setSolicitud(props.idSolicitudFactura);
    }, []);
  
    return (
      <Fragment>
        <Modal
          closeOnOverlayClick={false}
          centered
          isOpen={props.openModalVerFactura}
          onClose={props.ModalVerFactura}
          bottomBar={
            <div className="nowrap">
              <span className="mr4">
                <Button variation="primary" onClick={props.ModalVerFactura}>
                  Cerrar
                </Button>
              </span>
            </div>
          }
        >
          <h4>Solicitud de Factura</h4>
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 w-100-ns mv4 pv6-ns pl6-ns">
              <div className="w-100 mv6">
                <Input
                  label="Fecha de Solicitud"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.fechaSolicitudFactura?.split("T")[0]}
                />
              </div>
              {props?.detalle[0]?.idCliente > 0 ? (
                <div className="w-100 mv6">
                  <Input
                    label="Matrícula"
                    readOnly
                    size="small"
                    value={props?.detalle[0]?.idCliente}
                  />
                </div>
              ) : (
                <div></div>
              )}
  
              <div className="w-100 mv6">
                <Input
                  label="Estatus"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.status}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="Clave del Pedido"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.clavePedido}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="Nombre o Razón Social"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.nombreClienteRazonSocial}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="RFC"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.rfc}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="Correo Electrónico"
                  readOnly
                  value={props?.detalle[0]?.correoElectronico}
                  size="small"
                />
              </div>
              {props?.detalle[0]?.extranjero ? (
                <div>
                  <div className="w-100 mv6">
                    <Input
                      label="País"
                      size="small"
                      readOnly
                      value={props?.detalle[0]?.pais}
                    />
                  </div>
                  <div className="w-100 mv6">
                    <Input
                      label="Número de Identificación Fiscal"
                      readOnly
                      size="small"
                      value={props?.detalle[0]?.numeroIdFiscal}
                    />
                  </div>
                </div>
              ) : (
                <span></span>
              )}
  
              <div className="w-100 mv6">
                <Input
                  label="Uso de CFDI"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.usoCfdi}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="Clave de Uso de CFDI"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.claveUsoCfdi}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="Fecha de Pago"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.fechaPago?.split("T")[0]}
                />
              </div>
              <div className="w-100 mv6">
                <Input
                  label="Monto"
                  readOnly
                  size="small"
                  value={props?.detalle[0]?.monto}
                />
              </div>
              <div className="w-100 mv6">
                <Textarea
                  label="Comentarios:"
                  resize="none"
                  value={props?.detalle[0]?.comentarios}
                  size="regular"
                  rows={6}
                  readOnly
                />
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }

export default InvoiceButton
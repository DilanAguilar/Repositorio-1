/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, Fragment, useState } from 'react'
import { Button } from 'vtex.styleguide'

export const SolicitarFactura: FC<any> = ({ orderId, facturas }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Fragment>
      <div className="mv3">
        {!facturas ? (
          <Button
            block
            variation="secondary"
            href={`/account#/facturacion?orderFacturacion=${orderId}`}
            onClick={() => handleOpen()}
          >
            SOLICITAR FACTURA
          </Button>
        ) : (
          <Button
            block
            variation="secondary"
            noUpperCase
            noWrap
            href={`/account#/facturacion?showInvoice=${orderId}`}
            onClick={() => handleOpen()}
          >
            VER SOLICITUD FACTURA
          </Button>
        )}
      </div>
    </Fragment>
  )
}

export default SolicitarFactura

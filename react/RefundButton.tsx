import React, { FC, Fragment, useState } from 'react'
import { Button } from 'vtex.styleguide'

export const RefoundButton: FC<any> = ({ orderId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Fragment>
      <div className="mv3">
        <Button
          block
          variation="primary"
          href={`/account#/facturacion?orderReembolsos=${orderId}`}
          onClick={() => handleOpen()}
        >
          Solicitar Reembolso
        </Button>
      </div>
    </Fragment>
  )
}

export default RefoundButton

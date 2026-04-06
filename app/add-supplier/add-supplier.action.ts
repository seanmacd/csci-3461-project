'use server'

import {addSupplier} from '@/data/db'
import {isMysqlError} from '@/utils/is-mysql-error'
import type {SupplierForm} from './supplier-form.schema'

export const addSupplierAction = async (data: SupplierForm): Promise<{error?: string}> => {
  try {
    await addSupplier(data)
    return {}
  } catch (error) {
    console.log(error)
    if (isMysqlError(error) && error.code === 'ER_DUP_ENTRY') {
      return {error: error.sqlMessage}
    } else {
      return {error: 'An unexpected error occurred while adding the supplier. Please try again.'}
    }
  }
}

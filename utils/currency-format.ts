export const currencyValueFormatter = (params: any) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(params.value)
}

'use client'

import {ActionIcon, Box, Button, Group, Input, NumberInput, Paper, Stack, Text, TextInput} from '@mantine/core'
import {schemaResolver, useForm} from '@mantine/form'
import {notifications} from '@mantine/notifications'
import {PlusIcon, TrashIcon} from '@phosphor-icons/react/dist/ssr'
import {useState} from 'react'
import {addSupplierAction} from './add-supplier.action'
import {type SupplierForm, SupplierFormSchema} from './supplier-form.schema'

export function AddSupplier() {
  const [loading, setLoading] = useState(false)

  const form = useForm<SupplierForm>({
    initialValues: {id: '' as unknown as number, name: '', email: '', phoneNumbers: ['']},
    validate: schemaResolver(SupplierFormSchema, {sync: true})
  })

  const addPhone = () => {
    form.setFieldValue('phoneNumbers', [...form.values.phoneNumbers, ''])
  }

  const removePhone = (index: number) => {
    const updated = form.values.phoneNumbers.filter((_, i) => i !== index)
    form.setFieldValue('phoneNumbers', updated)
  }

  const onSubmit = async (values: SupplierForm) => {
    setLoading(true)

    const {error} = await addSupplierAction(values)

    if (error) {
      notifications.show({
        title: 'Failed to register supplier',
        message: error,
        color: 'red',
        withBorder: true
      })
    } else {
      notifications.show({
        title: 'Supplier registered',
        message: `Supplier ${values.name} was successfully registered.`,
        color: 'green',
        withBorder: true
      })
      form.reset()
    }

    setLoading(false)
  }

  return (
    <Box p="md">
      <Text size="lg" fw={500}>
        Register New Supplier
      </Text>
      <Text size="sm" c="dimmed" mb="lg">
        Add a new supplier to your database
      </Text>

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Paper withBorder p="md" maw={650}>
          <Stack gap="xs">
            <Group gap="xs" align="flex-start">
              <NumberInput label="Supplier ID" placeholder="42" {...form.getInputProps('id')} w={150} />
              <TextInput label="Supplier Name" placeholder="My New Supplier" {...form.getInputProps('name')} flex={1} />
            </Group>

            <TextInput
              label="Email Address"
              placeholder="supplier@example.com"
              type="email"
              {...form.getInputProps('email')}
            />

            <Input.Wrapper label="Phone Numbers" description="Add one or more contact phone numbers for this supplier.">
              {form.values.phoneNumbers.map((_, index) => (
                <TextInput
                  key={index}
                  placeholder="(902) 555-1234"
                  my="calc(var(--mantine-spacing-sm) / 2)"
                  {...form.getInputProps(`phoneNumbers.${index}`)}
                  rightSection={
                    form.values.phoneNumbers.length > 1 && (
                      <ActionIcon color="red" variant="subtle" onClick={() => removePhone(index)}>
                        <TrashIcon size={16} />
                      </ActionIcon>
                    )
                  }
                />
              ))}

              <Button variant="subtle" onClick={addPhone} leftSection={<PlusIcon size={16} />} fullWidth>
                Add phone number
              </Button>
            </Input.Wrapper>

            <Group justify="flex-end">
              <Button type="submit" loading={loading}>
                Register Supplier
              </Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Box>
  )
}

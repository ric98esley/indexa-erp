export const useBrands = () => {
  return class BrandService {
    async getBrands({
      name,
      offset,
      limit,
    }:{
      name?: string,
      offset?: number,
      limit?: number,
    }) {
      try {
        const { data, error } = await useFetch<{ total: number, rows: Brand[] }>('/brands',
          {
            params: {
              ...(name != '' && name && {
                name
              }),
              ...(offset && {
                offset: (offset - 1) * Number(limit)
              }),
              ...(limit && {
                limit
              })
            }
          }
        );
        if (error.value) {
          ElNotification({
            message: 'Error al obtener las marcas intente de nuevo mas tarde'
          })
        }
        return { data, error }
      } catch (error) {
        console.log(error);
      }
    }

    async createBrand({
      name
    }: {
      name: string
    }) {
      try {
        const { data, error } = await useFetch<Brand>('/brands',
          {
            method: 'post',
            body: {
              name,
            }
          },
        )
        if (error.value && error.value.statusCode && error.value.statusCode >= 400) {
          ElNotification({
            title: 'Error al crear marca intente de nuevo mas tarde',
            message: error.value?.data.message.message,
          })
          return
        }
        ElNotification({
          title: 'Marca creada correctamente',
          message: `${data.value?.name}`
        })

        return { data, error }
      } catch (error) {
        console.error(error)
      }
    }

    async patchBrand({
      name,
      id,
    }:{
      name: string,
      id: number
    }) {
      try {
        const body = {
          name,
        }

        console.log(body)

        const { data, error } = await useFetch<Brand>(`/brands/${id}`,
          {
            method: 'PATCH',
            body
          }
        );

        if (error.value) {
          throw error
        }
        ElNotification({
          title: 'Marca modificada correctamente',
          message: `${data.value?.name}`
        })

        return { data, error }
      } catch (error) {
        ElNotification({
          title: 'Error al modificar la marca intente de nuevo mas tarde',
        })
        console.log(error)
      }
    }

    async removeBrand(id: number) {
      try {
        const { data, error } = await useFetch<Brand>(`/brands/${id}`, {
          method: 'delete'
        })

        if (error.value) {
          throw new Error();
        }
        ElNotification({
          message: 'La marca ha sido borrada.'
        })
        return { data, error }
      } catch (error) {
        ElNotification({
          message: 'Error al borrar la marca intente de nuevo mas tarde.'
        })
      }
    }
  }
}
import useFetch from './utils/useFetch'
import { useFullSession } from 'vtex.session-client'
import './global.css'

const ProfileEditButton = () => {
  const { data } = useFullSession()
   console.log('profileeditbutton')

  const userId = data?.session?.namespaces?.profile?.id?.value

  return <ProfileEditButtonChild userId={userId} />
}

const ProfileEditButtonChild = ({ userId }: any) => {
  const { data }: any = useFetch(
    `/api/dataentities/CL/search?userId=${userId}&_fields=perfilAlumno`
  )
  
  const perfilAlumno = data?.[0]?.perfilAlumno
  console.log('userId', userId, ' perfilAlumno', perfilAlumno)
  if(perfilAlumno === false) {
    console.log('entro')
    const elements = Array.from(document.getElementsByClassName('vtex-my-account-1-x-boxContainerFooter') as HTMLCollectionOf<HTMLElement>)
    elements[0].style.display = "flex";
  }

  if(perfilAlumno === true) {
    const elements = Array.from(document.getElementsByClassName('vtex-my-account-1-x-boxContainerFooter') as HTMLCollectionOf<HTMLElement>)
    elements[0].remove()
  }

  return null
}

export default ProfileEditButton
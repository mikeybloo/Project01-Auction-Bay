import type { FC } from 'react'
import { usePageIdentification } from './Hooks/usePageIdentification'
import { observer } from 'mobx-react'
import Routes from './Routes/Routes'

const App: FC = () => {
  usePageIdentification()

  return <Routes />
}

export default observer(App);

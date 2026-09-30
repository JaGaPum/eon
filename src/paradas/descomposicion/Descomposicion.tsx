import Parada, { type PropsParada } from '../../componentes/Parada'
import Entender from './Entender'
import Probar from './Probar'
import Desmenuzar from './Desmenuzar'
import Practicar from './Practicar'

export default function Descomposicion({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="descomposicion"
      titulo="Descomposición factorial"
      modo={modo}
      paneles={{
        entender: <Entender />,
        probar: <Probar />,
        desmenuzar: <Desmenuzar />,
        practicar: <Practicar progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}

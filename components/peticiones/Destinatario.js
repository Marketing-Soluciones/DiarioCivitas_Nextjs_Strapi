import { CuadroAyudaMedium } from "./CuadrosAyudas"
import { FieldArrayField } from "../forms/inputs/FieldArrayField"
import { InputField } from "../forms/inputs/InputField"

export const EscogeDestinatario = ({ onClick }) => {
    return (
        <>
            <h3 className="text-2xl font-bold ">
                Escoge a un destinatario
            </h3>

            <p className="w-3/4 my-4 ">
                Esta persona, organización o grupo puede tomar la decisión sobre tu petición.
            </p>

            <div className="w-3/4 my-4 grid justify-items-stretch ">

                {/* <FieldArrayField
                    label="tags"
                    className="focus:outline-none w-full border-2 border-gray-300 rounded-md py-2 px-3"
                    name="tags"
                    schema={"string"}
                /> */}

                <InputField
                    name="subTitle"
                    className="focus:outline-none w-full border-2 border-gray-300 rounded-md py-2 px-3"
                />

                <button onClick={() => onClick()} className="bg-blueFull py-2 rounded-lg mt-2 text-center text-white w-1/4 items-end justify-self-end font-bold">Continuar</button>
            </div>

            <CuadroAyudaMedium
                titulo1={"Elige a alguien que pueda darte lo que necesitas"}
                info1={'Puede que tengas que investigar un poco para encontrar a la persona correcta que pueda tomar la decisión final o influir en ella.'}

                titulo2={"No vayas a lo alto de la jerarquía"}
                info2={'Es probable que veas resultados más rápidos si escoges a una persona que reciba peticiones con menos frecuencia que otras figuras más reconocidas.'}

                titulo3={"Elige a alguien que pueda responder"}
                info3={'Es más probable que tu petición resulte victoriosa si llegas a un acuerdo con el destinatario.'}
            />

        </>
    )
}
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from "./services/api";

interface CustomerProps{
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
};

export default function App() {

  const [customers, setCustomers] = useState<CustomerProps[]>([]);

  const nameRef = useRef< HTMLInputElement | null >(null);
  const emailRef = useRef< HTMLInputElement | null >(null);

  useEffect(() => {
    loadCustomers();
  }, [])

  async function loadCustomers() {
    
    const response = await api.get("/customers");
    setCustomers(response.data);

  }

  async function handleSubmit(e:FormEvent) {  

    e.preventDefault();

    if(!nameRef || !emailRef) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    });

    setCustomers(allCustomers => [response.data, ...allCustomers]);

  }

  async function handleDelete(id: string) {

    try {
      await api.delete("/customer", {
        params:{
          id: id,
        }
      });

      const allCustomers = customers.filter((element) => element.id !== id);
      setCustomers(allCustomers);

    } catch(err) {
      console.log(err);
    };
    
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">

        <h1 className="text-4xl font-bold text-white">
          API DE CADASTRO DE CLIENTES
        </h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>

          <label className="font-medium text-white">Nome:</label>
          <input placeholder="Digite o seu NOME COMPLETO..."
            className="w-full mb-5 p-2 rounded"
            type="text"
            ref={nameRef}
           />

          <label className="font-medium text-white">E-Mail:</label>
          <input placeholder="Digite o seu ENDEREÇO DE E-MAIL..."
            className="w-full mb-5 p-2 rounded"
            type="text"
            ref={emailRef}
           />
          
          <input 
            type="submit"
            value="Enviar"
            className="cursor-pointer w-full p-2 bg-blue-800 rounded font-semibold text-white"
           />

        </form>

        <section className="flex flex-col gap-4">

          {customers.map((element) => (

            <article key={element.id} className="w-full bg-blue-100 rounded p-2 relative hover:scale-95 duration-200">

            <p>
              <span className="font-semibold">Nome:</span> {element.name}
            </p>
            <p>
              <span className="font-semibold">E-Mail:</span> {element.email}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {element.status ? "ATIVO" : "INATIVO"}
            </p>

            <button className="bg-blue-400 w-7 h-7 flex items-center justify-center rounded-lg absolute right-3 top-3" onClick={() => handleDelete(element.id)}>           
              <FiTrash size={18} color="#FFF"/>
            </button>

            </article>

          ))}

        </section>

      </main>
    </div>
  )

}
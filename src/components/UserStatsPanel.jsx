import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { FaWhatsapp, FaRegThumbsUp, FaFileAlt, FaPhoneAlt, FaHandshake, FaLayerGroup    } from "react-icons/fa";
import { MdOutlineContentPasteSearch, MdAssuredWorkload, MdWorkHistory, MdWorkOff, MdOutgoingMail      } from "react-icons/md";
import { FaBoxesPacking, FaMoneyBill1Wave, FaMoneyBillTrendUp   } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";
import { TbCalendarClock } from "react-icons/tb";
import { GrTask } from "react-icons/gr";
import { LiaIndustrySolid } from "react-icons/lia";
import { RiSortNumberDesc } from "react-icons/ri";
import { LuFileSearch } from "react-icons/lu";
import { BsFillHouseAddFill, BsFillHouseFill  } from "react-icons/bs";

const gestionIconos = {
  "Alta de plan de pagos": <FaHandshake  size={32} color="#DBAA6E" />,
  "Alta plan de pagos": <FaHandshake  size={32} color="#DBAA6E" />,
  "Contacto demandado": <FaRegThumbsUp size={32} color="orange" />,
  "Contacto empleador": <FaFileAlt size={32} color="blue" />,
  "Armado Paquetes": <FaBoxesPacking size={32} color="#D48524" />,
  "Consulta ordenes de pago": <FaMoneyBill1Wave size={32} color="#57C785" />,
  "Contacto empleador": <LiaIndustrySolid size={32} color="green"/>,
  "Consulta juzgado": <GoLaw  size={32} color="black"/>,
  "Sin trabajo": <MdWorkOff size={32} color="black"/>,
  "Embargo en cola": <TbCalendarClock size={32} color="#EB4444"/>,
  "Tiene plata": <FaMoneyBillTrendUp size={32}/>,
  "Reenvio oficio": <MdOutgoingMail size={32} color="#94BBE9"/>,
  "Orden Legajos": <GrTask size={32} color="#FDBB2D"/>,
  "Orden cedulas procesadas/sin procesar":<FaLayerGroup size={32} color="#99a7bfff"/>,
  "Carga número de expedientes": <RiSortNumberDesc size={32} color="#11111"/>,
  "Analisis Expediente": <LuFileSearch size={32} color="orange"/>,
  "Búsqueda de domicilio": <BsFillHouseAddFill size={32} color="#08993eff"/>
};

const tareaIconos = {
  Whatsapp: <FaWhatsapp size={32} color="#25D366" />,
  Llamados: <FaPhoneAlt size={32} color="#25D366" />,
  Control_Oficios: <MdOutlineContentPasteSearch size={32} />,
  "Consulta Laboral": <MdAssuredWorkload size={32}/>,
  Orden: <MdWorkHistory size={32} color="#636E67"/>,
  Busqueda_de_domicilio: <BsFillHouseFill  size={32}/>

};

const UserStatsPanel = () => {
  const [resumen, setResumen] = useState([]);

  useEffect(() => {
    const cargarTareas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "tareas"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const conteo = {};

      querySnapshot.forEach((doc) => {
        const { tarea, gestion, cantidad } = doc.data();
        const key = `${tarea}-${gestion}`;

        if (!conteo[key]) {
          conteo[key] = {
            tarea,
            gestion,
            cantidad: 0,
          };
        }

        conteo[key].cantidad += cantidad;
      });

      setResumen(Object.values(conteo));
    };

    cargarTareas();
  }, []);

  return (
    <div>
      <h4 className="mb-4">Resumen de tareas</h4>
      <div className="row">
        {resumen.map((item, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="mb-2">
                  {tareaIconos[item.tarea] || <span>🔧</span>}
                </div>
                <div className="card-title">{item.tarea}</div>
                <div className="mb-2">
                  {gestionIconos[item.gestion] || <span>📋</span>}
                </div>
                <div className="card-subtitlemb-2 text-muted">
                  {item.gestion}
                </div>
                <h3>{item.cantidad}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatsPanel;

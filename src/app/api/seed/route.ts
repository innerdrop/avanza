
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        // Clear existing jobs
        await prisma.jobPosting.deleteMany({});

        const jobs = [
            // --- USHUAIA ---
            // Gastronomía y Turismo
            {
                title: "Cocinero/a con experiencia",
                company: "Restaurante Fueguino",
                location: "Ushuaia",
                type: "Full Time",
                description: "Buscamos cocinero/a con experiencia comprobable en cocina regional y manejo de fuegos. Disponibilidad horaria para turnos rotativos.",
                requirements: JSON.stringify(["Experiencia previa de 2 años", "Referencias comprobables", "Libreta sanitaria al día"]),
                responsibilities: JSON.stringify(["Elaboración de menú regional", "Control de stock", "Mantenimiento de limpieza del área"]),
                benefits: JSON.stringify(["Comida en turno", "Plus de temporada", "Uniforme"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-02-28")
            },
            {
                title: "Recepcionista de Hotel Bilingüe",
                company: "Hotel Los Andes",
                location: "Ushuaia",
                type: "Full Time",
                description: "Importante hotel 4 estrellas busca recepcionista con excelente dominio de inglés. Se valorará conocimientos de portugués.",
                requirements: JSON.stringify(["Inglés avanzado (excluyente)", "Experiencia en hotelería", "Manejo de sistemas de gestión hotelera"]),
                responsibilities: JSON.stringify(["Check-in/Check-out", "Atención al huésped", "Gestión de reservas", "Facturación"]),
                benefits: JSON.stringify(["Transporte", "Comedor en planta", "Capacitación continua"]),
                salary: "Sindicato UTHGRA",
                status: "active",
                expiresAt: new Date("2026-03-15")
            },
            {
                title: "Guía de Turismo",
                company: "Excursiones Fin del Mundo",
                location: "Ushuaia",
                type: "Part Time",
                description: "Buscamos guías de turismo matriculados para temporada de cruceros y turismo invernal.",
                requirements: JSON.stringify(["Credencial habilitante", "Idiomas Inglés/Portugués", "Primeros auxilios"]),
                responsibilities: JSON.stringify(["Conducción de grupos", "Coordinación de traslados", "Asistencia a pasajeros"]),
                benefits: JSON.stringify(["Comisiones por pasajeros", "Capacitación"],),
                salary: "Por hora/excursión",
                status: "active",
                expiresAt: new Date("2026-04-01")
            },
            {
                title: "Ayudante de Cocina",
                company: "Bodegón del Puerto",
                location: "Ushuaia",
                type: "Full Time",
                description: "Se necesita ayudante de cocina proactivo y responsable para temporada alta.",
                requirements: JSON.stringify(["Experiencia en puesto similar", "Disponibilidad inmediata"]),
                responsibilities: JSON.stringify(["Mise en place", "Lavado", "Asistencia al chef"]),
                benefits: JSON.stringify(["Alimentación", "Buen clima laboral"]),
                salary: "Convenio",
                status: "active",
                expiresAt: new Date("2026-02-20")
            },
            {
                title: "Mucama/o de Piso",
                company: "Hotel Canal Beagle",
                location: "Ushuaia",
                type: "Full Time",
                description: "Personal para limpieza de habitaciones y áreas comunes en hotel céntrico.",
                requirements: JSON.stringify(["Experiencia previa", "Detallista", "Responsable"]),
                responsibilities: JSON.stringify(["Limpieza de habitaciones", "Recambio de ropa blanca", "Reporte de mantenimiento"]),
                benefits: JSON.stringify(["Estabilidad", "Premios por presentismo"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-02-25")
            },

            // Comercio
            {
                title: "Vendedor/a de Salón",
                company: "Tienda Outdoor Patagonia",
                location: "Ushuaia",
                type: "Full Time",
                description: "Buscamos vendedores apasionados por el aire libre para tienda de indumentaria técnica.",
                requirements: JSON.stringify(["Experiencia en ventas", "Conocimiento de equipamiento outdoor", "Buena presencia"]),
                responsibilities: JSON.stringify(["Asesoramiento al cliente", "Control de stock", "Caja", "Orden del local"]),
                benefits: JSON.stringify(["Comisiones por ventas", "Descuentos en productos"]),
                salary: "Comercio + Comisiones",
                status: "active",
                expiresAt: new Date("2026-02-10")
            },
            {
                title: "Cajero/a Administrativo",
                company: "Supermercado Austral",
                location: "Ushuaia",
                type: "Full Time",
                description: "Cajero con perfil administrativo para manejo de valores y atención al cliente.",
                requirements: JSON.stringify(["Secundario completo", "Experiencia en manejo de caja", "Referencias"]),
                responsibilities: JSON.stringify(["Cobro a clientes", "Arqueo de caja", "Atención telefónica"]),
                benefits: JSON.stringify(["Ingreso inmediato", "Posibilidad de efectivización"]),
                salary: "Convenio Comercio",
                status: "active",
                expiresAt: new Date("2026-02-15")
            },
            {
                title: "Repositor",
                company: "Distribuidora Fueguina",
                location: "Ushuaia",
                type: "Full Time",
                description: "Repositor externo para recorrer supermercados y mayoristas.",
                requirements: JSON.stringify(["Movilidad propia (deseable)", "Experiencia en reposición"]),
                responsibilities: JSON.stringify(["Reposición de mercadería", "Control de vencimientos", "Exhibición"]),
                benefits: JSON.stringify(["Viáticos", "Premios por objetivos"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-03-01")
            },
            {
                title: "Atención al Cliente",
                company: "Farmacia del Valle",
                location: "Ushuaia",
                type: "Part Time",
                description: "Atención en mostrador de farmacia y perfumería.",
                requirements: JSON.stringify(["Experiencia en farmacia", "Manejo de posnet", "Buena dicción"]),
                responsibilities: JSON.stringify(["Atención al público", "Recepción de pedidos", "Control de stock"]),
                benefits: JSON.stringify(["Obra social", "Descuento empleados"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-02-28")
            },

            // Tècnico y Logística
            {
                title: "Jefe de Depósito",
                company: "Logística Fin del Mundo",
                location: "Ushuaia",
                type: "Full Time",
                description: "Coordinar operaciones de recepción, almacenamiento y despacho de mercaderías.",
                requirements: JSON.stringify(["Experiencia en liderazgo", "Manejo de autoelevadores", "Sistemas WMS"]),
                responsibilities: JSON.stringify(["Gestión de inventarios", "Liderar equipo de trabajo", "Logística de distribución"]),
                benefits: JSON.stringify(["Comedor", "Prepagas para grupo familiar"]),
                salary: "$ 1.2M - 1.5M",
                status: "active",
                expiresAt: new Date("2026-03-20")
            },
            {
                title: "Técnico en Mantenimiento Edilicio",
                company: "Servicios Integrales S.A.",
                location: "Ushuaia",
                type: "Full Time",
                description: "Técnico para mantenimiento general de edificios públicos y oficinas.",
                requirements: JSON.stringify(["Conocimientos de electricidad", "Plomería", "Gas", "Licencia de conducir"]),
                responsibilities: JSON.stringify(["Mantenimiento preventivo", "Reparaciones generales", "Guardias pasivas"]),
                benefits: JSON.stringify(["Vehículo de la empresa", "Celular corporativo"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-02-28")
            },
            {
                title: "Chófer de Camión",
                company: "Transportes Patagónicos",
                location: "Ushuaia",
                type: "Full Time",
                description: "Chófer con licencia LINTI para distribución local y viajes a Río Grande.",
                requirements: JSON.stringify(["Licencia LINTI cargas generales", "Experiencia camiones chasis y acoplado"]),
                responsibilities: JSON.stringify(["Reparto de mercadería", "Cuidado de la unidad", "Documentación de carga"]),
                benefits: JSON.stringify(["Viáticos", "Premios km"]),
                salary: "Convenio 40/89",
                status: "active",
                expiresAt: new Date("2026-03-10")
            },

            // Salud
            {
                title: "Enfermero/a Profesional",
                company: "Clínica San Jorge",
                location: "Ushuaia",
                type: "Full Time",
                description: "Incorporamos enfermeros profesionales para internación general y guardia.",
                requirements: JSON.stringify(["Título habilitante", "Matrícula provincial", "Disponibilidad rotativa"]),
                responsibilities: JSON.stringify(["Atención de pacientes", "Suministro de medicación", "Registros de enfermería"]),
                benefits: JSON.stringify(["Capacitación", "Comedor"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-03-30")
            },

            // --- RIO GRANDE ---
            // Industria y Técnica
            {
                title: "Técnico Electrónico",
                company: "Fábrica Austral Electrónica",
                location: "Río Grande",
                type: "Full Time",
                description: "Técnico para línea de producción y reparación de placas.",
                requirements: JSON.stringify(["Técnico Electrónico graduado", "Experiencia en soldadura SMD", "Interpretación de planos"]),
                responsibilities: JSON.stringify(["Diagnóstico de fallas", "Reparación de componentes", "Control de calidad"]),
                benefits: JSON.stringify(["Combi", "Comedor en planta", "Premio producción"]),
                salary: "UOM",
                status: "active",
                expiresAt: new Date("2026-03-01")
            },
            {
                title: "Operario de Producción",
                company: "Mirgor S.A.",
                location: "Río Grande",
                type: "Full Time",
                description: "Operarios para línea de ensamblaje en industria automotriz y electrónica.",
                requirements: JSON.stringify(["Secundario completo", "Disponibilidad turnos rotativos", "Residencia en Río Grande"]),
                responsibilities: JSON.stringify(["Ensamblaje", "Empaque", "Control visual"]),
                benefits: JSON.stringify(["Traslado", "Comedor", "Premios"]),
                salary: "UOM",
                status: "active",
                expiresAt: new Date("2026-02-15")
            },
            {
                title: "Ingeniero de Procesos",
                company: "BGH",
                location: "Río Grande",
                type: "Full Time",
                description: "Ingeniero para optimización de líneas de producción y mejora continua.",
                requirements: JSON.stringify(["Ing. Industrial/Electrónico", "Inglés intermedio", "Lean Manufacturing"]),
                responsibilities: JSON.stringify(["Análisis de tiempos", "Balanceo de líneas", "Implementación de mejoras"]),
                benefits: JSON.stringify(["Prepaga Grupo Familiar", "Bono anual", "Relocation package"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-04-01")
            },
            {
                title: "Técnico de Seguridad e Higiene",
                company: "Consultora SyH",
                location: "Río Grande",
                type: "Part Time",
                description: "Asesoramiento y control en plantas industriales y obras.",
                requirements: JSON.stringify(["Matrícula habilitante", "Experiencia en industria", "Movilidad propia"]),
                responsibilities: JSON.stringify(["Capacitaciones", "Mediciones", "Auditorías de campo"]),
                benefits: JSON.stringify(["Flexibilidad horaria", "Viáticos"]),
                salary: "Por hora profesional",
                status: "active",
                expiresAt: new Date("2026-03-15")
            },

            // Servicios y Administración RG
            {
                title: "Gestor Comercial",
                company: "Banco Tierra del Fuego",
                location: "Río Grande",
                type: "Full Time",
                description: "Ejecutivo para atención de cartera de clientes Pyme.",
                requirements: JSON.stringify(["Estudiante/Graduado Cs Económicas", "Perfil comercial", "Experiencia bancaria"]),
                responsibilities: JSON.stringify(["Venta de productos financieros", "Análisis de riesgo", "Visita a clientes"]),
                benefits: JSON.stringify(["Bancarios", "Bono por objetivos"]),
                salary: "Convenio Bancario",
                status: "active",
                expiresAt: new Date("2026-03-01")
            },
            {
                title: "Administrativo de Pagos",
                company: "Cooperativa Eléctrica",
                location: "Río Grande",
                type: "Full Time",
                description: "Administrativo para sector de tesorería y pagos.",
                requirements: JSON.stringify(["Secundario completo", "Manejo de Excel", "Experiencia en cajas"]),
                responsibilities: JSON.stringify(["Control de facturas", "Emisión de pagos", "Conciliaciones"]),
                benefits: JSON.stringify(["Estabilidad", "Obra social"]),
                salary: "Luz y Fuerza",
                status: "active",
                expiresAt: new Date("2026-02-28")
            },
            {
                title: "Vendedor de Planes de Ahorro",
                company: "Concesionaria Ford",
                location: "Río Grande",
                type: "Full Time",
                description: "Vendedores con marcado perfil comercial para venta de 0km.",
                requirements: JSON.stringify(["Experiencia en venta telefónica", "Proactivo", "Ambicioso"]),
                responsibilities: JSON.stringify(["Captación de leads", "Cierre de ventas", "Seguimiento"]),
                benefits: JSON.stringify(["Las mejores comisiones del mercado", "Premios"]),
                salary: "Básico + Comisiones",
                status: "active",
                expiresAt: new Date("2026-03-10")
            },

            // Varios Ushuaia y Rio Grande y Tolhuin
            {
                title: "Panadero/a",
                company: "Panadería La Unión",
                location: "Tolhuin",
                type: "Full Time",
                description: "Maestro panadero para famosa panadería de la isla.",
                requirements: JSON.stringify(["Experiencia en panadería artesanal", "Facturas", "Disponibilidad madrugadas"]),
                responsibilities: JSON.stringify(["Amasado", "Horneado", "Limpieza"]),
                benefits: JSON.stringify(["Vivienda (a conversar)", "Sueldo competitivo"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-03-01")
            },
            {
                title: "Médico Clínico",
                company: "Centro Médico Tolhuin",
                location: "Tolhuin",
                type: "Full Time",
                description: "Médico para consultorios externos y guardia pasiva.",
                requirements: JSON.stringify(["Título y Matrícula", "Residencia completa"]),
                responsibilities: JSON.stringify(["Atención ambulatoria", "Guardias"]),
                benefits: JSON.stringify(["Vivienda institucional", "Plus zona desfavorable"]),
                salary: "Muy atractivo",
                status: "active",
                expiresAt: new Date("2026-04-01")
            },
            {
                title: "Personal de Limpieza",
                company: "Limpiar TDF",
                location: "Río Grande",
                type: "Part Time",
                description: "Limpieza de oficinas y consorcios.",
                requirements: JSON.stringify(["Experiencia comprobable", "Referencias"]),
                responsibilities: JSON.stringify(["Limpieza de pisos", "Baños", "Vidrios"]),
                benefits: JSON.stringify(["Blaqueo inmediato"]),
                salary: "SOM",
                status: "active",
                expiresAt: new Date("2026-02-20")
            },
            {
                title: "Docente de Inglés",
                company: "Instituto de Idiomas",
                location: "Ushuaia",
                type: "Part Time",
                description: "Profesor/a para niños y adolescentes en turno tarde.",
                requirements: JSON.stringify(["Profesorado o Traductorado", "Experiencia con niños"]),
                responsibilities: JSON.stringify(["Dictado de clases", "Preparación de material", "Exámenes"]),
                benefits: JSON.stringify(["Material didáctico", "Capacitación"]),
                salary: "Hora cátedra",
                status: "active",
                expiresAt: new Date("2026-02-25")
            },
            {
                title: "Mecánico Automotriz",
                company: "Taller Integral Sur",
                location: "Río Grande",
                type: "Full Time",
                description: "Mecánico oficial con experiencia en inyección electrónica.",
                requirements: JSON.stringify(["Experiencia 5 años", "Manejo de scanner"]),
                responsibilities: JSON.stringify(["Diagnóstico", "Service", "Reparación de motores"]),
                benefits: JSON.stringify(["Ropa de trabajo", "Premios"]),
                salary: "SMATA",
                status: "active",
                expiresAt: new Date("2026-03-05")
            },
            {
                title: "Encargado de Local",
                company: "Cadena de Electrodomésticos",
                location: "Ushuaia",
                type: "Full Time",
                description: "Líder para sucursal de venta de electrodomésticos.",
                requirements: JSON.stringify(["Experiencia en liderazgo", "Venta retail", "Manejo de caja"]),
                responsibilities: JSON.stringify(["Apertura/Cierre", "Gestión de personal", "Objetivos de venta"]),
                benefits: JSON.stringify(["Bono anual", "Prepaga"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-03-15")
            },

            // IT & Remote from TDF
            {
                title: "Soporte Técnico IT",
                company: "Soluciones Informáticas Austral",
                location: "Ushuaia",
                type: "Presencial",
                description: "Soporte nivel 1 y 2 para empresas clientes.",
                requirements: JSON.stringify(["Windows Server", "Redes", "Hardware"]),
                responsibilities: JSON.stringify(["Tickets de soporte", "Mantenimiento preventivo", "Instalaciones"]),
                benefits: JSON.stringify(["Guardias pagas"]),
                salary: "Comercio Informática",
                status: "active",
                expiresAt: new Date("2026-02-28")
            },
            {
                title: "Community Manager",
                company: "Agencia Fueguina de Marketing",
                location: "Rio Grande",
                type: "Híbrido",
                description: "Gestión de redes sociales para clientes locales.",
                requirements: JSON.stringify(["Diseño Gráfico básico", "Meta Ads", "Copywriting"]),
                responsibilities: JSON.stringify(["Grilla de contenidos", "Respuesta a usuarios", "Reportes"]),
                benefits: JSON.stringify(["Flexibilidad"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-03-01")
            },
            {
                title: "Analista de Datos",
                company: "Pesquera del Sur",
                location: "Ushuaia",
                type: "Full Time",
                description: "Analista para control de producción y exportaciones.",
                requirements: JSON.stringify(["Excel Avanzado/PowerBI", "Estadística", "Inglés"]),
                responsibilities: JSON.stringify(["Reportes de producción", "Análisis de costos", "Tableros de control"]),
                benefits: JSON.stringify(["Comedor", "Transporte"]),
                salary: "Jerárquico",
                status: "active",
                expiresAt: new Date("2026-03-20")
            },

            // More General
            {
                title: "Cuidador/a Domiciliario",
                company: "Servicios de Salud",
                location: "Río Grande",
                type: "Part Time",
                description: "Acompañante terapéutico o cuidador para adulto mayor.",
                requirements: JSON.stringify(["Vocación de servicio", "Referencias", "Monotributo"]),
                responsibilities: JSON.stringify(["Acompañamiento", "Administración de medicamentos", "Higiene y confort"]),
                benefits: JSON.stringify(["Pago semanal"]),
                salary: "Por hora",
                status: "active",
                expiresAt: new Date("2026-02-15")
            },
            {
                title: "Albañil Oficial",
                company: "Constructora del Fuego",
                location: "Ushuaia",
                type: "Full Time",
                description: "Oficiales albañiles para obra en construcción en altura.",
                requirements: JSON.stringify(["Experiencia en obra grande", "Herramientas propias de mano"]),
                responsibilities: JSON.stringify(["Mampostería", "Revoques", "Hormigón"]),
                benefits: JSON.stringify(["Fondo de desempleo", "UOCRA"]),
                salary: "UOCRA",
                status: "active",
                expiresAt: new Date("2026-03-01")
            },
            {
                title: "Vigilador General",
                company: "Seguridad Austral",
                location: "Río Grande",
                type: "Full Time",
                description: "Vigiladores para objetivos físicos (fábricas, predios).",
                requirements: JSON.stringify(["Secundario completo", "Sin antecedentes", "Curso habilitante"]),
                responsibilities: JSON.stringify(["Control de ingreso/egreso", "Rondas", "Libro de actas"]),
                benefits: JSON.stringify(["Horas extras", "Uniforme"]),
                salary: "Convenio Seguridad",
                status: "active",
                expiresAt: new Date("2026-02-28")
            },
            {
                title: "Pizzero / Planchero",
                company: "Pizzería El Hornito",
                location: "Ushuaia",
                type: "Noche",
                description: "Para turno noche en local de comidas rápidas.",
                requirements: JSON.stringify(["Experiencia en despacho rápido", "Disponibilidad fines de semana"]),
                responsibilities: JSON.stringify(["Elaboración de pizzas", "Hamburguesas", "Limpieza"]),
                benefits: JSON.stringify(["Cena", "Propina"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-02-20")
            },
            {
                title: "Instructor de Esquí",
                company: "Cerro Castor",
                location: "Ushuaia",
                type: "Temporada Invierno",
                description: "Pre-selección para temporada 2026.",
                requirements: JSON.stringify(["Nivel 2 AADIDESS o equivalente", "Idiomas"]),
                responsibilities: JSON.stringify(["Clases grupales e individuales", "Niños y adultos"]),
                benefits: JSON.stringify(["Pase de medios", "Uniforme", "Comedor"]),
                salary: "A convenir",
                status: "active",
                expiresAt: new Date("2026-05-01")
            },
            {
                title: "Cadete Administrativo",
                company: "Estudio Jurídico",
                location: "Río Grande",
                type: "Part Time",
                description: "Estudiante de derecho para trámites en tribunales y bancos.",
                requirements: JSON.stringify(["Estudiante de Derecho", "Responsable", "Buena presencia"]),
                responsibilities: JSON.stringify(["Trámites", "Mesa de entradas", "Archivo"]),
                benefits: JSON.stringify(["Experiencia en el fuero"]),
                salary: "Media jornada",
                status: "active",
                expiresAt: new Date("2026-02-25")
            },
            {
                title: "Preventista",
                company: "Distribuidora de Bebidas",
                location: "Ushuaia",
                type: "Full Time",
                description: "Vendedor de calle para canal kioscos y almacenes.",
                requirements: JSON.stringify(["Experiencia en ventas consumo masivo", "Vehículo propio (excluyente)"]),
                responsibilities: JSON.stringify(["Visita a clientes", "Toma de pedidos", "Cobranza"]),
                benefits: JSON.stringify(["Viáticos vehículo", "Comisiones"]),
                salary: "Básico + Variable",
                status: "active",
                expiresAt: new Date("2026-03-05")
            },
            {
                title: "Técnico en Refrigeración",
                company: "FrioSur",
                location: "Río Grande",
                type: "Full Time",
                description: "Instalación y reparación de aires acondicionados y cámaras.",
                requirements: JSON.stringify(["Matriculado", "Experiencia 3 años"]),
                responsibilities: JSON.stringify(["Instalaciones", "Cargas de gas", "Mantenimiento"]),
                benefits: JSON.stringify(["Vehículo", "Herramientas"]),
                salary: "UOCRA",
                status: "active",
                expiresAt: new Date("2026-03-15")
            },
            {
                title: "Auxiliar de Depósito",
                company: "Supermercado La Anónima",
                location: "Ushuaia",
                type: "Full Time",
                description: "Descarga de camiones y orden de depósito.",
                requirements: JSON.stringify(["Fuerza física", "Disponibilidad horaria"]),
                responsibilities: JSON.stringify(["Descarga", "Estibado", "Control de remitos"]),
                benefits: JSON.stringify(["Comedor", "Beneficios corporativos"]),
                salary: "Comercio",
                status: "active",
                expiresAt: new Date("2026-02-20")
            },
            {
                title: "Representante de Atención Telefónica",
                company: "Contact Center TDF",
                location: "Río Grande",
                type: "Part Time",
                description: "Atención al cliente para campaña de servicios públicos.",
                requirements: JSON.stringify(["Secundario completo", "Buen manejo de PC", "Voz clara"]),
                responsibilities: JSON.stringify(["Atención de reclamos", "Consultas comerciales"]),
                benefits: JSON.stringify(["Jornadas de 4 o 6 horas"]),
                salary: "Comercio Call Center",
                status: "active",
                expiresAt: new Date("2026-02-28")
            }
        ];

        for (const job of jobs) {
            await prisma.jobPosting.create({ data: job });
        }

        return NextResponse.json({ message: 'Jobs seeded successfully', count: jobs.length });
    } catch (error) {
        console.error('Error seeding jobs:', error);
        return NextResponse.json(
            { error: 'Error seeding jobs' },
            { status: 500 }
        );
    }
}


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const jobs = [
    // USHUAIA
    {
        title: "Operario Eventual de Logística",
        company: "Logística Fueguina S.A.",
        location: "Ushuaia",
        type: "Full Time",
        description: "Buscamos operarios eventuales para tareas de carga y descarga, control de stock y armado de pedidos en nuestro centro de distribución. Se valora experiencia previa en depósitos y disponibilidad horaria rotativa.",
        requirements: ["Secundario completo", "Experiencia en depósitos (deseable)", "Disponibilidad para turnos rotativos", "Residencia en Ushuaia"],
        responsibilities: ["Carga y descarga de mercadería", "Control de stock", "Preparación de pedidos", "Orden y limpieza del sector"],
        benefits: ["Comedor en planta", "Transporte a cargo de la empresa", "Pago de horas extras"],
        salary: "$ 950.000 - $ 1.100.000",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Enfermero/a Profesional",
        company: "Clínica San Jorge",
        location: "Ushuaia",
        type: "Full Time",
        description: "Importante institución de salud selecciona Enfermeros/as Profesionales para incorporar a su equipo de trabajo. Buscamos perfiles con vocación de servicio, empatía y capacidad de trabajo en equipo.",
        requirements: ["Título de Enfermero/a Profesional y Matrícula Habilitante", "Experiencia mínima de 1 año en internación general o guardia", "Disponibilidad full time"],
        responsibilities: ["Atención y cuidado de pacientes", "Administración de medicación", "Control de signos vitales", "Registros de enfermería"],
        benefits: ["Obra social de primera línea", "Capacitación continua", "Beneficios en farmacia"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Analista Funcional Supply Chain",
        company: "Grupo Mirgor",
        location: "Ushuaia",
        type: "Full Time",
        description: "Estamos buscando un Analista Funcional para sumarse a nuestro equipo de Supply Chain. El objetivo de la posición es analizar y proponer mejoras en los procesos logísticos y de abastecimiento, asegurando la eficiencia operativa.",
        requirements: ["Graduado en Ingeniería Industrial, Lic. en Administración o afines", "Experiencia en Supply Chain / Logística", "Manejo avanzado de Excel y SAP", "Inglés intermedio"],
        responsibilities: ["Análisis de procesos logísticos", "Implementación de mejoras", "Seguimiento de KPIs", "Interacción con proveedores y clientes internos"],
        benefits: ["Bono anual por desempeño", "Prepaga para grupo familiar", "Descuentos en productos de la compañía"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Asesor/a Comercial",
        company: "Automotores del Sur",
        location: "Ushuaia",
        type: "Full Time",
        description: "Concesionaria líder busca Asesor/a Comercial para venta de vehículos 0km y usados. Nos orientamos a perfiles proactivos, con marcada orientación a resultados y vocación comercial.",
        requirements: ["Experiencia en ventas (excluyente)", "Licencia de conducir vigente", "Marcado perfil comercial", "Buenas habilidades de comunicación"],
        responsibilities: ["Asesoramiento a clientes", "Venta de vehículos y planes de ahorro", "Seguimiento de prospectos", "Manejo de CRM"],
        benefits: ["Sueldo básico + Comisiones sin tope", "Premios por objetivos", "Capacitación constante"],
        salary: "$ 800.000 + Comisiones",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Vendedor de Local - Indumentaria",
        company: "Sport Total",
        location: "Ushuaia",
        type: "Full Time",
        description: "Buscamos vendedores/as con experiencia para nuestras sucursales en Ushuaia. Si te gusta la moda y el deporte, y tenés buena atención al cliente, ¡sumate a nuestro equipo!",
        requirements: ["Experiencia en ventas y atención al cliente", "Disponibilidad para trabajar fines de semana y feriados (horario comercio)", "Secundario completo"],
        responsibilities: ["Atención al cliente", "Venta y cobro", "Orden y reposición de mercadería", "Control de stock"],
        benefits: ["Descuentos en indumentaria", "Comisiones por venta", "Uniforme a cargo de la empresa"],
        salary: "$ 750.000 - $ 900.000",
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Personal de Limpieza Eventual",
        company: "LimpiFuego",
        location: "Ushuaia",
        type: "Part Time",
        description: "Empresa de limpieza busca personal para cubrir vacaciones y eventos. Tareas de limpieza general en oficinas y espacios comunes.",
        requirements: ["Experiencia comprobable en limpieza", "Referencias laborales", "Disponibilidad horaria"],
        responsibilities: ["Limpieza de pisos y superficies", "Limpieza de baños", "Retiro de residuos"],
        benefits: ["Incorporación inmediata", "Pago quincenal"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Recepcionista Bilingüe",
        company: "Hotel Los Yamanas",
        location: "Ushuaia",
        type: "Full Time",
        description: "Hotel 4 estrellas selecciona Recepcionista Bilingüe (Inglés/Español) para atención a huéspedes. Valoramos conocimientos de sistema PMS y experiencia previa.",
        requirements: ["Inglés avanzado (excluyente)", "Experiencia en recepción de hoteles", "Disponibilidad para turnos rotativos"],
        responsibilities: ["Check-in y Check-out", "Atención telefónica y de reservas", "Asesoramiento turístico", "Facturación"],
        benefits: ["Comedor de personal", "Uniforme", "Excelente clima laboral"],
        salary: "$ 1.000.000 - $ 1.200.000",
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Chofer de Distribución",
        company: "Distribuidora Austral",
        location: "Ushuaia",
        type: "Full Time",
        description: "Se necesita Chofer con registro profesional para reparto de mercadería en la ciudad de Ushuaia. Responsable y con conocimiento de las calles.",
        requirements: ["Licencia de conducir profesional (Cargas Generales)", "Experiencia en reparto", "Certificado de antecedentes penales"],
        responsibilities: ["Reparto de mercadería en tiempo y forma", "Cuidado de la unidad", "Rendición de hojas de ruta"],
        benefits: ["Estabilidad laboral", "Premios por presentismo"],
        salary: "$ 1.100.000 neto",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Administrativo Contable Junior",
        company: "Estudio Contable Finisterre",
        location: "Ushuaia",
        type: "Full Time",
        description: "Estudio contable busca estudiante avanzado o recién graduado de Contador Público para tareas de asistencia contable e impositiva.",
        requirements: ["Estudiante avanzado o graduado de CP", "Conocimientos de aplicativos AFIP", "Manejo de Excel"],
        responsibilities: ["Carga de comprobantes", "Conciliaciones bancarias", "Liquidación de impuestos (IVA, IIBB)", "Trámites generales"],
        benefits: ["Capacitación profesional", "Posibilidades de crecimiento"],
        salary: "$ 850.000",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Cocinero/a con experiencia",
        company: "Restaurante El Viejo Marino",
        location: "Ushuaia",
        type: "Full Time",
        description: "Restaurante de comida regional busca Cocinero/a con experiencia en despacho y producción. Se valora conocimiento en frutos de mar.",
        requirements: ["Experiencia comprobable mínima de 2 años", "Carnet de manipulación de alimentos", "Disponibilidad turno noche"],
        responsibilities: ["Producción de mise en place", "Despacho de platos en servicio", "Limpieza y orden de la cocina"],
        benefits: ["Sueldo acorde a convenio", "Propinas", "Cena incluida"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },

    // RÍO GRANDE
    {
        title: "Vendedor/a Viajante (Tierra del Fuego)",
        company: "Distribuidora Mayorista Patagonia",
        location: "Río Grande",
        type: "Full Time",
        description: "Importante distribuidora de consumo masivo busca Vendedor/a Viajante para cubrir la zona de Río Grande y Tolhuin. Se requiere movilidad propia.",
        requirements: ["Experiencia en venta externa", "Movilidad propia en buen estado", "Residir en Río Grande", "Perfil proactivo"],
        responsibilities: ["Visita a clientes según ruteo", "Toma de pedidos", "Cobranzas", "Desarrollo de cartera de clientes"],
        benefits: ["Viáticos y combustible", "Comisiones por venta y cobranza", "Celular corporativo"],
        salary: "Base + Comisiones",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Enfermero/a para Guardia",
        company: "Sanatorio Fueguino",
        location: "Río Grande",
        type: "Full Time",
        description: "Sanatorio Fueguino incorpora Enfermeros/as para cubrir guardias activas. Excelentes condiciones de contratación.",
        requirements: ["Título y Matrícula Provincial", "Experiencia en guardia/urgencias", "Disponibilidad horaria"],
        responsibilities: ["Atención de urgencias", "Triage", "Asistencia a médicos de guardia"],
        benefits: ["Pago de horas guardia", "Formación continua"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Productor Asesor de Seguros",
        company: "Organización de Seguros RG",
        location: "Río Grande",
        type: "Freelance",
        description: "Buscamos personas emprendedoras que quieran desarrollarse como Productores de Seguros. Ofrecemos plan de carrera y excelentes comisiones.",
        requirements: ["Marcado perfil comercial", "Autogestión", "No se requiere experiencia previa (brindamos capacitación)"],
        responsibilities: ["Captación de clientes", "Asesoramiento en productos de seguros", "Fidelización de cartera"],
        benefits: ["Altas comisiones", "Flexibilidad horaria", "Capacitación para matriculación"],
        salary: "Comisiones",
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Profesor/a de Apoyo Escolar",
        company: "Instituto Aprender",
        location: "Río Grande",
        type: "Part Time",
        description: "Instituto educativo busca profesores/as para brindar apoyo escolar nivel primario y secundario, y técnicas de estudio.",
        requirements: ["Título docente o estudiante avanzado", "Experiencia docente", "Paciencia y pedagogía"],
        responsibilities: ["Dictado de clases de apoyo", "Seguimiento de alumnos", "Preparación de material didáctico"],
        benefits: ["Pago por hora cátedra", "Horarios flexibles"],
        salary: "$ 6000 / hora",
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Técnico Electromecánico",
        company: "Industria Plástica RG",
        location: "Río Grande",
        type: "Full Time",
        description: "Planta industrial selecciona Técnico Electromecánico para mantenimiento preventivo y correctivo de líneas de producción.",
        requirements: ["Técnico Electromecánico graduado", "Experiencia en industrias (plásticos preferentemente)", "Conocimientos de neumática e hidráulica"],
        responsibilities: ["Mantenimiento preventivo", "Diagnóstico y resolución de fallas", "Montaje de nuevas máquinas"],
        benefits: ["Comedor en planta", "Transporte", "Bono de producción"],
        salary: "$ 1.300.000",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Gestor de Trámites",
        company: "Estudio Jurídico Integral",
        location: "Río Grande",
        type: "Part Time",
        description: "Buscamos gestor para realizar trámites bancarios, judiciales y administrativos en la ciudad de Río Grande.",
        requirements: ["Secundario completo", "Moto propia (deseable)", "Responsabilidad y puntualidad"],
        responsibilities: ["Trámites bancarios", "Presentación de escritos", "Pago de servicios"],
        benefits: ["Viáticos", "Flexibilidad horaria"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Cajero/a de Supermercado",
        company: "La Anónima",
        location: "Río Grande",
        type: "Full Time",
        description: "Cadena de supermercados busca Cajeros/as y Repositores para sus sucursales en Río Grande. Se valora experiencia previa.",
        requirements: ["Secundario completo", "Disponibilidad para horarios rotativos y fines de semana"],
        responsibilities: ["Manejo de caja", "Atención al cliente", "Reposición de mercadería en tiempos libres"],
        benefits: ["Beneficios corporativos", "Sueldo de convenio comercio"],
        salary: "$ 850.000",
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Técnico Radiólogo",
        company: "Centro de Diagnóstico por Imágenes",
        location: "Río Grande",
        type: "Part Time",
        description: "Centro médico incorpora Técnico Radiólogo con experiencia en Rayos X y Mamografía.",
        requirements: ["Título de Técnico Radiólogo y Matrícula", "Experiencia comprobable", "Disponibilidad turno tarde"],
        responsibilities: ["Realización de estudios radiológicos", "Atención al paciente", "Cuidado del equipamiento"],
        benefits: ["Excelente clima de trabajo", "Equipamiento de última generación"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Repositor Externo",
        company: "Agencia de Reposición",
        location: "Río Grande",
        type: "Part Time",
        description: "Buscamos repositores para recorrer supermercados y mayoristas, asegurando la exhibición de productos de primeras marcas.",
        requirements: ["Experiencia en reposición", "Libreta sanitaria al día", "Celular con datos"],
        responsibilities: ["Reposición de góndolas", "Control de vencimientos", "Armado de exhibiciones", "Reporte de stock"],
        benefits: ["Sueldo fijo", "Viáticos"],
        salary: "$ 450.000 media jornada",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Operario de Producción Electrónica",
        company: "Electrofueguina",
        location: "Río Grande",
        type: "Full Time",
        description: "Importante fábrica de electrónica incorpora operarios para línea de producción. Contratación eventual con posibilidad de efectivización.",
        requirements: ["Secundario completo (excluyente)", "Experiencia en industria electrónica (deseable)", "Disponibilidad turnos rotativos"],
        responsibilities: ["Ensamble de componentes", "Control de calidad visual", "Embalaje"],
        benefits: ["Comedor en planta", "Transporte"],
        salary: "$ 1.000.000",
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },

    // TOLHUIN
    {
        title: "Operario de Aserradero",
        company: "Maderas del Corazón",
        location: "Tolhuin",
        type: "Full Time",
        description: "Aserradero en Tolhuin busca operarios para tareas generales de producción maderera. Se valora fuerza física y responsabilidad.",
        requirements: ["Residir en Tolhuin", "Experiencia en aserraderos (no excluyente)"],
        responsibilities: ["Carga y descarga de madera", "Operación de máquinas simples", "Limpieza del predio"],
        benefits: ["Estabilidad laboral"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Oficial Albañil",
        company: "Constructora Tolhuin",
        location: "Tolhuin",
        type: "Full Time",
        description: "Empresa constructora busca Oficial Albañil para obras civiles en la localidad de Tolhuin.",
        requirements: ["Experiencia comprobable como oficial", "Herramientas de mano propias", "Disponibilidad inmediata"],
        responsibilities: ["Mampostería", "Revoques", "Colocación de cerámicos", "Hormigón"],
        benefits: ["Pago semanal", "Premio por final de obra"],
        salary: "Jornal UOCRA + Plus",
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Empleado/a de Comercio (Polirrubro)",
        company: "Polirrubro El Lago",
        location: "Tolhuin",
        type: "Full Time",
        description: "Buscamos empleado/a para atención al público, reposición y limpieza en polirrubro céntrico.",
        requirements: ["Buena presencia", "Trato amable", "Referencias comprobables"],
        responsibilities: ["Atención al cliente", "Caja", "Reposición de mercadería"],
        benefits: ["Trabajo estable"],
        salary: "$ 700.000",
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Panadero/a",
        company: "Panadería La Unión",
        location: "Tolhuin",
        type: "Full Time",
        description: "Histórica panadería de Tolhuin busca Panadero/a con experiencia en amasado y horneado de panificados y facturas.",
        requirements: ["Experiencia en panadería", "Conocimiento de hornos rotativos", "Disponibilidad para trabajar de madrugada"],
        responsibilities: ["Amasado y elaboración de productos", "Horneado", "Limpieza de cuadra"],
        benefits: ["Sueldo acorde al puesto", "Beneficios en productos"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Atención al Público - Panadería",
        company: "Panadería La Unión",
        location: "Tolhuin",
        type: "Part Time",
        description: "Buscamos personal para atención al público en mostrador y cafetería. Turnos rotativos.",
        requirements: ["Experiencia en atención al público", "Simpatía y buena predisposición", "Residir en Tolhuin"],
        responsibilities: ["Atención en mostrador", "Preparación de café", "Mantenimiento del salón"],
        benefits: ["Buen clima laboral"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Personal de Mantenimiento General",
        company: "Hostería Tolhuin",
        location: "Tolhuin",
        type: "Full Time",
        description: "Hostería busca persona polivalente para mantenimiento general de las instalaciones (pintura, electricidad básica, plomería).",
        requirements: ["Conocimientos generales de oficios", "Herramientas básicas", "Proactividad"],
        responsibilities: ["Reparaciones menores", "Pintura", "Mantenimiento de parque"],
        benefits: ["Almuerzo incluido"],
        salary: "A convenir",
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Auxiliar Administrativo",
        company: "Aserradero Lenga",
        location: "Tolhuin",
        type: "Full Time",
        description: "Administración de aserradero busca auxiliar para facturación, control de remitos y atención a proveedores.",
        requirements: ["Secundario completo", "Manejo de PC (Office)", "Orden y prolijidad"],
        responsibilities: ["Facturación", "Archivos", "Atención telefónica"],
        benefits: ["Horario administrativo"],
        salary: "$ 750.000",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Chofer de Camión (Madera)",
        company: "Transporte Fueguino",
        location: "Tolhuin",
        type: "Full Time",
        description: "Se busca chofer con experiencia en transporte de cargas pesadas (madera) para viajes Ushuaia-Tolhuin-Río Grande.",
        requirements: ["Licencia Nacional Habilitante (LINTI)", "Experiencia en camiones con acoplado", "Residencia en Tolhuin preferentemente"],
        responsibilities: ["Transporte de carga", "Control de la unidad", "Cumplimiento de normas de tránsito"],
        benefits: ["Viáticos", "Sueldo de convenio Camioneros"],
        salary: "Convenio 40/89",
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Ayudante de Cocina",
        company: "Parador Ruta 3",
        location: "Tolhuin",
        type: "Part Time",
        description: "Parador gastronómico busca ayudante de cocina para fines de semana y feriados. Ideal para estudiantes.",
        requirements: ["Ganas de aprender", "Disponibilidad fines de semana"],
        responsibilities: ["Ayuda en elaboración de minutas", "Lavado de vajilla", "Limpieza de cocina"],
        benefits: ["Pago diario"],
        salary: "$ 25.000 por día",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Limpieza Institucional",
        company: "Cooperativa de Trabajo",
        location: "Tolhuin",
        type: "Full Time",
        description: "Cooperativa busca personal para limpieza de oficinas públicas y escuelas en Tolhuin.",
        requirements: ["Responsabilidad", "Disponibilidad horaria"],
        responsibilities: ["Limpieza general de edificios públicos"],
        benefits: ["Monotributo social"],
        salary: "$ 600.000",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    }
];

async function main() {
    console.log(`Start seeding ${jobs.length} jobs...`);

    for (const job of jobs) {
        const createdJob = await prisma.jobPosting.create({
            data: {
                title: job.title,
                company: job.company,
                location: job.location,
                type: job.type,
                description: job.description,
                requirements: JSON.stringify(job.requirements),
                responsibilities: JSON.stringify(job.responsibilities),
                benefits: JSON.stringify(job.benefits),
                salary: job.salary,
                expiresAt: job.expiresAt,
                status: 'active'
            },
        });
        console.log(`Created job with id: ${createdJob.id}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

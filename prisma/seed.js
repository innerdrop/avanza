const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jobs = [
    {
        title: "Administrativo Contable",
        company: "Estudio Contable Integral",
        location: "Ushuaia, Tierra del Fuego",
        type: "Full Time",
        salary: "$800.000 - $1.000.000 netos",
        description: "Buscamos un Administrativo Contable con experiencia para sumarse a nuestro equipo. La persona seleccionada será responsable de la gestión administrativa diaria, facturación, y conciliaciones bancarias.",
        requirements: JSON.stringify(["Experiencia mínima de 2 años en puestos similares", "Manejo de sistemas de gestión (Tango, Bejerman)", "Dominio de Excel avanzado", "Residencia en Ushuaia"]),
        responsibilities: JSON.stringify(["Carga de facturas de compras y ventas", "Conciliaciones bancarias y de tarjetas", "Liquidación de impuestos (IVA, IIBB)", "Atención a proveedores y clientes"]),
        benefits: JSON.stringify(["Obra social prepaga", "Capacitación constante", "Excelente clima laboral"]),
        status: "active"
    },
    {
        title: "Vendedor de Salón",
        company: "Tech Store Ushuaia",
        location: "Ushuaia, Tierra del Fuego",
        type: "Full Time",
        salary: "$700.000 + Comisiones",
        description: "Importante tienda de tecnología busca vendedor de salón proactivo y con ganas de crecer. Valoramos el conocimiento técnico y la vocación de servicio.",
        requirements: JSON.stringify(["Experiencia en ventas (preferentemente tecnología)", "Disponibilidad horaria (horario comercial)", "Secundario completo"]),
        responsibilities: JSON.stringify(["Atención y asesoramiento a clientes", "Control de stock y reposición", "Manejo de caja", "Mantenimiento del orden en el local"]),
        benefits: JSON.stringify(["Sueldo básico + comisiones por venta", "Descuentos en productos", "Posibilidades de crecimiento"]),
        status: "active"
    },
    {
        title: "Ayudante de Cocina",
        company: "Restaurante El Fueguino",
        location: "Ushuaia, Tierra del Fuego",
        type: "Part Time",
        salary: "$600.000 netos",
        description: "Restaurante gastronómico de primer nivel busca ayudante de cocina para turno noche. Buscamos personas responsables, dinámicas y con pasión por la gastronomía.",
        requirements: JSON.stringify(["Experiencia previa en cocina (no excluyente)", "Carnet de manipulación de alimentos vigente", "Disponibilidad para trabajar fines de semana"]),
        responsibilities: JSON.stringify(["Asistencia al chef en la preparación de platos", "Limpieza y orden de la cocina", "Recepción y control de mercadería"]),
        benefits: JSON.stringify(["Cena incluida", "Pago de horas extra", "Uniforme a cargo de la empresa"]),
        status: "active"
    }
];

async function main() {
    console.log('Start seeding...');
    for (const job of jobs) {
        const createdJob = await prisma.jobPosting.create({
            data: job,
        });
        console.log(`Created job with id: ${createdJob.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

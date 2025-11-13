// Mock data pour le développement sans API

export const mockProjects = [
  {
    id: 1,
    code: "PROJ-00001",
    title: "IT Infrastructure Upgrade",
    description: "Complete overhaul of company IT infrastructure",
    customerId: 1,
    status: "ACTIVE",
    startDate: "2025-11-12",
    endDate: "2026-05-12",
    budget: 150000,
    priority: "HIGH",
    managerId: 1,
    createdBy: 1,
    createdAt: "2025-11-12T00:43:20.000+00:00",
    updatedAt: "2025-11-12T00:43:20.000+00:00",
    progress: 50,
    customer: {
      id: 1,
      code: "CUST-00001",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1234567890",
      address: "123 Business Street",
      city: "New York",
      country: "USA",
      postalCode: "10001",
      taxId: "US123456789",
      customerType: "CORPORATE",
      isActive: 1,
      createdBy: 1,
      createdAt: "2025-11-12T00:43:18.000+00:00",
      updatedAt: "2025-11-12T00:43:18.000+00:00"
    },
    manager: {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Project Manager"
    },
    tasks: [
      {
        id: 1,
        code: "TASK-00001",
        title: "Infrastructure Assessment",
        description: "Assess current infrastructure",
        status: "DONE",
        priority: "HIGH",
        dueDate: "2025-11-07",
        projectId: 1,
        assignedTo: 1,
        createdBy: 1,
        createdAt: "2025-11-12T00:43:20.000+00:00",
        updatedAt: "2025-11-12T00:43:20.000+00:00"
      },
      {
        id: 2,
        code: "TASK-00002",
        title: "Hardware Procurement",
        description: "Order necessary hardware",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: "2025-11-22",
        projectId: 1,
        assignedTo: 2,
        createdBy: 1,
        createdAt: "2025-11-12T00:43:20.000+00:00",
        updatedAt: "2025-11-12T00:43:20.000+00:00"
      },
      {
        id: 3,
        code: "TASK-00003",
        title: "Network Configuration",
        description: "Configure network infrastructure",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "2025-12-01",
        projectId: 1,
        assignedTo: null,
        createdBy: 1,
        createdAt: "2025-11-12T00:43:20.000+00:00",
        updatedAt: "2025-11-12T00:43:20.000+00:00"
      }
    ],
    documents: [
      {
        id: 1,
        code: "DOC-00001",
        title: "Project Proposal",
        url: "/documents/project-proposal.pdf",
        fileType: "application/pdf",
        fileSize: 2048000,
        linkedTable: "projects",
        linkedId: 1,
        createdBy: 1,
        createdAt: "2025-11-12T00:43:18.000+00:00",
        updatedAt: "2025-11-12T00:43:18.000+00:00"
      },
      {
        id: 2,
        code: "DOC-00002",
        title: "Technical Specifications",
        url: "/documents/tech-specs.pdf",
        fileType: "application/pdf",
        fileSize: 1024000,
        linkedTable: "projects",
        linkedId: 1,
        createdBy: 1,
        createdAt: "2025-11-12T00:43:18.000+00:00",
        updatedAt: "2025-11-12T00:43:18.000+00:00"
      }
    ],
    rfqs: [
      {
        id: 1,
        code: "RFQ-00001",
        title: "Server Hardware Quote",
        description: "Request for quote for server hardware",
        status: "APPROVED",
        projectId: 1,
        supplierId: 1,
        totalAmount: 45000,
        validUntil: "2025-12-15",
        createdAt: "2025-11-10T00:00:00.000+00:00",
        supplier: {
          id: 1,
          code: "SUP-00001",
          name: "Tech Supply Co."
        }
      },
      {
        id: 2,
        code: "RFQ-00002",
        title: "Network Equipment Quote",
        description: "Request for quote for network switches and routers",
        status: "PENDING",
        projectId: 1,
        supplierId: 2,
        totalAmount: 28000,
        validUntil: "2025-11-30",
        createdAt: "2025-11-11T00:00:00.000+00:00",
        supplier: {
          id: 2,
          code: "SUP-00002",
          name: "Network Solutions Inc."
        }
      }
    ],
    salesOrders: [
      {
        id: 1,
        code: "SO-00001",
        orderNumber: "SO-2025-001",
        status: "CONFIRMED",
        projectId: 1,
        customerId: 1,
        totalAmount: 150000,
        orderDate: "2025-11-12",
        deliveryDate: "2026-05-12",
        createdAt: "2025-11-12T00:00:00.000+00:00"
      }
    ],
    purchaseOrders: [
      {
        id: 1,
        code: "PO-00001",
        orderNumber: "PO-2025-001",
        status: "APPROVED",
        projectId: 1,
        supplierId: 1,
        rfqId: 1,
        totalAmount: 45000,
        orderDate: "2025-11-13",
        expectedDelivery: "2025-12-01",
        createdAt: "2025-11-13T00:00:00.000+00:00",
        supplier: {
          id: 1,
          code: "SUP-00001",
          name: "Tech Supply Co."
        }
      },
      {
        id: 2,
        code: "PO-00002",
        orderNumber: "PO-2025-002",
        status: "PENDING",
        projectId: 1,
        supplierId: 2,
        rfqId: 2,
        totalAmount: 28000,
        orderDate: "2025-11-14",
        expectedDelivery: "2025-12-10",
        createdAt: "2025-11-14T00:00:00.000+00:00",
        supplier: {
          id: 2,
          code: "SUP-00002",
          name: "Network Solutions Inc."
        }
      }
    ]
  },
  {
    id: 2,
    code: "PROJ-00002",
    title: "E-commerce Platform Development",
    description: "Build a new e-commerce platform",
    customerId: 2,
    status: "PENDING",
    startDate: "2025-12-01",
    endDate: "2026-06-01",
    budget: 200000,
    priority: "MEDIUM",
    managerId: 2,
    createdBy: 1,
    createdAt: "2025-11-12T00:43:20.000+00:00",
    updatedAt: "2025-11-12T00:43:20.000+00:00",
    progress: 10,
    customer: {
      id: 2,
      code: "CUST-00002",
      name: "Retail Innovations Ltd",
      email: "contact@retailinnovations.com",
      phone: "+1234567891",
      address: "456 Commerce Ave",
      city: "Los Angeles",
      country: "USA",
      postalCode: "90001",
      taxId: "US987654321",
      customerType: "CORPORATE",
      isActive: 1,
      createdBy: 1,
      createdAt: "2025-11-12T00:43:18.000+00:00",
      updatedAt: "2025-11-12T00:43:18.000+00:00"
    },
    manager: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "Project Manager"
    },
    tasks: [],
    documents: [],
    rfqs: [],
    salesOrders: [],
    purchaseOrders: []
  }
];

export const getMockProjectById = (id: string | number) => {
  const project = mockProjects.find(p => p.id === Number(id));
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
};

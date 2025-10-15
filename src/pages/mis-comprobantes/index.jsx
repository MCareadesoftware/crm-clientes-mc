import React, { useMemo, useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import FormatDate from "@/utils/Formatters/FormatDate";
import FormatCurrency from "@/utils/Formatters/FormatCurrency";
import { BACKEND } from "@/configs/envConfig";
import Modal from "@/components/ui/Modal";
import FileActionCell from "@/components/ui/FileActionCell";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MisComprobantes = () => {
  const userRedux = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [quotations, setQuotations] = useState([]);
  const [quotationsMeta, setQuotationsMeta] = useState({
    totalPages: 0,
    page: 1,
    hasPrevPage: false,
    hasNextPage: false,
    totalDocs: 0,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const getQuotations = async () => {
    try {
      if (!userRedux?.user?.id) return;
      const url = `${BACKEND}/getQuotationData?clientId=${userRedux.user.id}&page=${currentPage}&limit=${limit}`;
      const response = await axios.get(url);
      console.log(response);
      setQuotations(response?.data?.docs || response?.data || []);
      setQuotationsMeta({
        totalPages: response?.data?.totalPages ?? 0,
        page: response?.data?.page ?? currentPage,
        hasPrevPage: response?.data?.hasPrevPage ?? currentPage > 1,
        hasNextPage: response?.data?.hasNextPage ?? false,
        totalDocs: response?.data?.totalDocs ?? 0,
      });
    } catch (error) {
      setQuotations([]);
    }
  };

  useEffect(() => {
    getQuotations();
  }, [currentPage, limit, userRedux?.user?.id]);

  const validatePdf = (file) => {
    if (!file) return false;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (!isPdf) {
      toast.error("Solo se admite PDF");
      return false;
    }
    if (file.size > maxBytes) {
      toast.error("El archivo supera 10 MB");
      return false;
    }
    return true;
  };

  const openUploadFor = (row) => {
    setSelectedQuotation(row?.original);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validatePdf(file)) return;
    setSelectedFile(file);
  };

  const uploadSignedContract = async () => {
    if (!selectedQuotation || !selectedFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("cotizacion", selectedQuotation?.idDocumento);
      formData.append("nombre", `Contrato firmado - ${selectedQuotation?.idDocumento}.pdf`);
      formData.append("tipo", "documentoFirmado");

      const uploadResp = await axios.post(`${BACKEND}/documentosCotizaciones`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (ev.total) {
            const p = Math.round((ev.loaded * 100) / ev.total);
            setUploadProgress(p);
          }
        },
      });

      const uploaded = uploadResp.data?.doc || uploadResp.data;
      if (!uploaded?.id) throw new Error("No se recibió ID del documento subido");

      await axios.put(`${BACKEND}/cotizaciones/${selectedQuotation?.idDocumento}`, {
        documentoFirmado: uploaded.id,
      });

      toast.success("Contrato firmado subido");
      setUploadModalOpen(false);
      setSelectedFile(null);
      setSelectedQuotation(null);
      setUploadProgress(0);
      await getQuotations();
    } catch (err) {
      console.log(err)
      toast.error("Error al subir el contrato firmado");
    } finally {
      setUploading(false);
    }
  };

  const COLUMNS = [
    {
      Header: "ID Cotización",
      accessor: "idDocumento",
      Cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs break-all max-w-[220px] inline-block">
            {row?.cell?.value}
          </span>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-900"
            onClick={() => navigator.clipboard?.writeText(row?.cell?.value)}
            title="Copiar ID"
          >
            <Icon icon="heroicons-outline:document-duplicate" />
          </button>
        </div>
      ),
    },
    {
      Header: "Servicios",
      accessor: "servicios",
      Cell: (row) => (
        <ul className="list-disc pl-4 space-y-1">
          {row?.cell?.value?.map((s, i) => (
            <li key={i} className="text-sm">{s}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "PDF Cotización",
      accessor: "cotizacionUrl",
      Cell: (row) => (
        <FileActionCell url={row?.cell?.value} downloadLabel="Descargar PDF de la cotización" showUpload={false} variant="success" />
      ),
    },
    {
      Header: "Contrato cotización",
      accessor: "contratoRecibidoUrl",
      Cell: (row) => (
        <FileActionCell url={row?.cell?.value} downloadLabel="Descargar contrato de agencia" showUpload={false} variant="success" />
      ),
    },
    {
      Header: "Contrato firmado",
      accessor: "comprobantesAgenciaUrl",
      Cell: (row) => (
        <FileActionCell
          url={row?.cell?.value}
          downloadLabel="Descargar contrato firmado"
          variant="success"
          onUpload={() => openUploadFor(row?.row)}
          exclusive
        />
      ),
    },
    {
      Header: "Vendedor",
      accessor: "vendedor",
      Cell: (row) => (
        <div className="text-sm whitespace-pre-line">{row?.cell?.value}</div>
      ),
    },
    {
      Header: "Fecha creación",
      accessor: "fechaCreacion",
      Cell: (row) => <span className="text-sm">{row.cell?.value ? FormatDate(row?.cell?.value) : "-"}</span>,
    },
    {
      Header: "Fecha venta",
      accessor: "fechaVenta",
      Cell: (row) => <span className="text-sm">{row.cell?.value ? FormatDate(row?.cell?.value) : "-"}</span>,
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (row) => <span className="text-sm">{row.cell?.value ? FormatCurrency(row?.cell?.value) : "-"}</span>,
    },
    {
      Header: "Deuda",
      accessor: "deuda",
      Cell: (row) => <span className="text-sm">{row.cell?.value ? FormatCurrency(row?.cell?.value) : "-"}</span>,
    },
    {
      Header: "N° cuotas",
      accessor: "cuotas",
      Cell: (row) => <span className="text-sm">{row.cell?.value ? row.cell?.value : "-"}</span>,
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => {
    if (!quotations || quotations.length === 0) return [];

    return quotations.map((q) => {
      const idDocumento = q?.id;
      const serviciosArray = Array.isArray(q?.servicios) ? q.servicios : [];
      const servicios = serviciosArray.map((s) => s?.servicio?.name).filter(Boolean);
      const vendedor = q?.cotizador?.nombre || "";
      const fechaCreacion = q?.createdAt || null;
      const fechaVenta = q?.fechaVenta || null;
      const total = q?.precioTotal ?? null;
      const pagado = q?.totalPagado ?? null;
      const deudaCalc = total - pagado;
      const cuotas = q.pagos.length ?? 0;
      const contratoCotizacion = q?.documentoContrato || "#";
      const pdfContrato = q?.pdfContrato || "#";
      const documentoFirmado = q?.documentoFirmado || "#";

      // documentoContrato: quotation.documentoContrato?.url || null,
      // pdfContrato: quotation.pdfContrato?.url || null,
      // documentoFirmado: quotation.documentoFirmado?.url || null,

      return {
        idDocumento,
        servicios: servicios.length ? servicios : ["-"],
        cotizacionUrl: pdfContrato,
        contratoRecibidoUrl: contratoCotizacion,
        emisionContratoUrl: pdfContrato,
        comprobantesAgenciaUrl: documentoFirmado,
        vendedor,
        fechaCreacion,
        fechaVenta: fechaVenta ? FormatDate(fechaVenta) : "-",
        total,
        deuda: deudaCalc ?? 0,
        cuotas,
      };
    });
  }, [quotations]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: tablePage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    prepareRow,
  } = tableInstance;

  const { pageIndex } = state;

  // Server-driven page range similar to servicios-activos
  const pageRange = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(
    currentPage + 2,
    quotationsMeta.totalPages ? quotationsMeta.totalPages : 1
  );
  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  return (
    <div>
      <Card>
        <ToastContainer />
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          scope="col"
                          className="table-th bg-orange-500 text-white text-xs"
                        >
                          <div className="flex items-center justify-center gap-1 w-full">
                            <span className="whitespace-nowrap">{column.render("Header")}</span>
                            <span>
                              {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {tablePage.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="even:bg-slate-50 dark:even:bg-slate-700/40">
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="table-td align-middle text-center">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {quotationsMeta?.totalPages > 1 && (
          <div className="flex flex-col items-center py-10">
            <span className="text-sm text-gray-700 dark:text-gray-500 mb-2 ">
              Mostrando
              <span className="font-semibold text-gray-900 dark:text-gray-300 "> {quotations?.length}</span> de
              <span className="font-semibold text-gray-900 dark:text-gray-300 "> {quotationsMeta?.totalDocs}</span> comprobantes
            </span>
            <nav aria-label="Page navigation example">
              <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 dark:bg-gray-600  dark:border-none bg-white border  border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className=" w-3 h-3 text-gray-700 dark:text-gray-400" />
                  </button>
                </li>
                {pageRange.map((pageNumber) => (
                  <li key={pageNumber}>
                    <button
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`flex items-center justify-center px-4 h-10 leading-tight ${
                        currentPage === pageNumber
                          ? "text-white dark:text-gray-300 dark:bg-blue-600  border-blue-300 dark:border-none bg-blue-600 hover:bg-blue-700  "
                          : "text-gray-500 bg-white border dark:bg-gray-300 border-gray-300 dark:border-none hover:bg-gray-100 hover:text-gray-700 "
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!quotationsMeta?.hasNextPage}
                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 dark:bg-gray-600 dark:border-none bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 "
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className=" w-3 h-3 text-gray-700 dark:text-gray-400" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </Card>
      <Modal
        activeModal={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Subir contrato firmado (PDF)"
        className="max-w-lg"
        centered
      >
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:tex-slate-300">
            Descarga el contrato (columna contrato cotización), fírmalo y sube el archivo acá. Tamaño máximo 10 MB.
          </div>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {uploading && (
            <div className="pt-2">
              <div className="text-xs mb-1">Subiendo... {uploadProgress}%</div>
              <div className="w-full h-2 bg-slate-200 rounded">
                <div
                  className="h-2 bg-primary-600 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => setUploadModalOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`btn ${selectedFile ? "btn-dark" : "btn-primary"}`}
              onClick={uploadSignedContract}
              disabled={!selectedFile || uploading}
            >
              Subir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MisComprobantes;
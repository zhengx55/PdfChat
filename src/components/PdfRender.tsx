"use client";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Rotate3DIcon,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
import { useForm } from "react-hook-form";
import { z } from "zod";
import SimpleBar from "simplebar-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import PdfFullscreen from "./PdfFullscreen";
type Props = {
  url: string;
};

const PdfRender = ({ url }: Props) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [totalPages, setTotalPages] = useState<number>();
  const [curPage, setCurPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= totalPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={totalPages === undefined || curPage === 1}
            variant="ghost"
            aria-label="previous page"
            onClick={() => {
              if (curPage > 0) {
                setCurPage((prev) => prev - 1);
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zin-700 text-xs space-x-1">
              <span>/</span>
              <span>{totalPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={totalPages === undefined || curPage === totalPages}
            variant="ghost"
            aria-label="next page"
            onClick={() => {
              if (curPage < totalPages!) {
                setCurPage((prev) => prev + 1);
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant={"ghost"} className="gap-1.5">
                <Search className="h- 4 w-4" />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            aria-label="rotate 90"
            onClick={() => {
              setRotation((prev) => prev + 90);
            }}
          >
            <Rotate3DIcon className="h-4 w-4" />
          </Button>
          <PdfFullscreen fileUrl={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-25 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setTotalPages(numPages);
              }}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF file",
                  description: "Please try again",
                  variant: "destructive",
                });
              }}
              file={url}
              className="max-h-full"
            >
              <Page
                scale={scale}
                pageNumber={curPage}
                width={width ? width : 1}
                rotate={rotation}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRender;

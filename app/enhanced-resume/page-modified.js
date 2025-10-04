"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Download,
  Edit3,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Plus,
  Wand2,
  Settings,
  Eye,
  Save,
  X,
  FileText,
  Star,
  Zap,
  Target,
  User,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
} from "lucide-react";
import { TextSelectionMenu } from "@/components/TextSelectionMenu";

export default function EnhancedResume() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(null);
  const [userName, setUserName] = useState("Advika Sharma");
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isFromUpload = searchParams.get("from") === "upload";
  const isFromAI = searchParams.get("from") === "ai";
  const selectedTemplate = searchParams.get("template") ?? "saanvi-patel-1";
"use client";

import { useState, useEffect } from "react";
import styles from "@/app/styles/components/TextSelectionMenu.module.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Zap } from "lucide-react";

export function TextSelectionMenu({ onEnhance }) {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(text);
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 60,
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleClickOutside = () => {
      setIsVisible(false);
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEnhance = () => {
    onEnhance(selectedText);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card
      className="fixed z-50 bg-white shadow-lg border-2 border-primary/20 p-2"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
      }}
    >
      <Button
        size="sm"
        onClick={handleEnhance}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <Wand2 className="h-3 w-3" />
        Enhance with AI
        <Zap className="h-3 w-3" />
      </Button>
    </Card>
  );
}

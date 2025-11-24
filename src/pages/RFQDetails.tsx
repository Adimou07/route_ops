import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  ChevronDown,
  ChevronUp,
  Package,
  Wrench,
  Key,
  Plus,
  Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockRFQDetails } from "@/data/mockData";
import { Separator } from "@/components/ui/separator";

interface RFQItem {
  id: number;
  itemType: string;
  partNumber: string;
  designation: string;
  quantity: number;
  unit: string;
  priceCurrency: string;
  costUnitForeign: number;
  discountRate?: number;
  discountAmount?: number;
  margin?: number;
  unitPriceForeign: number;
  specifications?: string;
  notes?: string;
  periodStart?: string;
  periodEnd?: string;
  billingCycleUnit?: string;
  billingCycleCount?: number;
  recurringPrice?: number;
  setupFee?: number;
  transportCost?: number;
  customsDutyRate?: number;
  isPerpetual?: boolean;
}

const RFQDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [globalFxRate, setGlobalFxRate] = useState(600);
  const [globalTaxRate, setGlobalTaxRate] = useState(mockRFQDetails.globalTaxRate || 18);
  const [items, setItems] = useState<RFQItem[]>(mockRFQDetails.items.map(item => ({
    ...item,
    margin: 10,
    transportCost: item.itemType === 'product' ? (item.transportCost || 0) : undefined,
    customsDutyRate: item.itemType === 'product' ? (item.customsDutyRate || 0) : undefined,
    isPerpetual: item.itemType === 'subscription' ? (item.isPerpetual || false) : undefined
  })));

  const updateItem = (itemId: number, updates: Partial<RFQItem>) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const rfq = mockRFQDetails;

  const toggleItem = (itemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "APPROVED": return "default";
      case "QUOTED": return "secondary";
      case "REJECTED": return "destructive";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number, currency: string = "XOF") => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateItemTotals = (item: RFQItem) => {
    const costInLocalCurrency = item.costUnitForeign * (item.priceCurrency !== rfq.baseCurrency ? globalFxRate : 1);
    const totalCost = costInLocalCurrency * item.quantity;
    
    const supplierDiscount = item.discountRate 
      ? totalCost * (item.discountRate / 100)
      : item.discountAmount || 0;
    
    const costAfterDiscount = totalCost - supplierDiscount;
    
    // Add transport and customs for products
    const transportCost = item.transportCost || 0;
    const customsDuty = item.customsDutyRate 
      ? costAfterDiscount * (item.customsDutyRate / 100) 
      : 0;
    
    const totalCostWithImport = costAfterDiscount + transportCost + customsDuty;
    const marginAmount = totalCostWithImport * ((item.margin || 0) / 100);
    const sellingPrice = totalCostWithImport + marginAmount;
    
    // Calculate tax on selling price
    const taxAmount = sellingPrice * (globalTaxRate / 100);
    const sellingPriceInclTax = sellingPrice + taxAmount;
    
    return {
      costInLocalCurrency,
      totalCost,
      supplierDiscount,
      costAfterDiscount,
      transportCost,
      customsDuty,
      totalCostWithImport,
      marginAmount,
      sellingPrice,
      taxAmount,
      sellingPriceInclTax,
      marginRate: item.margin || 0
    };
  };

  const calculateGlobalTotals = () => {
    let totalCost = 0;
    let totalSelling = 0;
    let totalMargin = 0;
    let totalTransport = 0;
    let totalCustoms = 0;
    let totalTax = 0;
    
    items.forEach(item => {
      const itemTotals = calculateItemTotals(item);
      totalCost += itemTotals.totalCostWithImport;
      totalSelling += itemTotals.sellingPrice;
      totalMargin += itemTotals.marginAmount;
      totalTransport += itemTotals.transportCost;
      totalCustoms += itemTotals.customsDuty;
      totalTax += itemTotals.taxAmount;
    });
    
    const grandTotal = totalSelling + totalTax;
    
    return {
      totalCost,
      totalSelling,
      totalMargin,
      marginRate: totalCost > 0 ? (totalMargin / totalCost) * 100 : 0,
      totalTransport,
      totalCustoms,
      totalTax,
      grandTotal
    };
  };

  const totals = calculateGlobalTotals();

  const getItemIcon = (itemType: string) => {
    switch(itemType) {
      case 'product': return <Package className="h-5 w-5 text-primary" />;
      case 'service': return <Wrench className="h-5 w-5 text-accent" />;
      case 'subscription': return <Key className="h-5 w-5 text-warning" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-card via-primary/5 to-card shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/rfq")}
                className="shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">{rfq.code}</h1>
                  <Badge variant={getStatusVariant(rfq.status)} className="shadow-sm">
                    {rfq.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Client: {rfq.customer.name} • Projet: {rfq.project?.title || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 shadow-sm">
                <FileText className="h-4 w-4" />
                Exporter PDF
              </Button>
              <Button className="gap-2 shadow-sm">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Date RFQ</Label>
              <Input type="date" defaultValue={rfq.rfqDate} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Date limite</Label>
              <Input type="date" defaultValue={rfq.responseDeadline} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Devise de base</Label>
              <Select defaultValue={rfq.baseCurrency}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">XOF</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">💱 Taux de change global</Label>
              <Input 
                type="number" 
                step="0.01"
                value={globalFxRate} 
                onChange={(e) => setGlobalFxRate(parseFloat(e.target.value) || 0)}
                className="mt-1 font-semibold border-primary/50"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">📊 Taux de taxe global (%)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={globalTaxRate} 
                onChange={(e) => setGlobalTaxRate(parseFloat(e.target.value) || 0)}
                className="mt-1 font-semibold border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Totaux - Sticky */}
        <div className="flex-shrink-0 bg-gradient-to-br from-primary/15 via-accent/10 to-success/10 border-b-2 border-primary/20 shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-card/60 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">💰 Total Achat</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(totals.totalCost)}</p>
            </div>
            <div className="text-center p-3 bg-card/60 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">📈 Marge</p>
              <p className="text-lg font-bold text-success">{formatCurrency(totals.totalMargin)}</p>
              <p className="text-xs text-success font-medium">({totals.marginRate.toFixed(1)}%)</p>
            </div>
            <div className="text-center p-3 bg-card/60 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">🚚 Transport</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(totals.totalTransport)}</p>
            </div>
            <div className="text-center p-3 bg-card/60 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">🛃 Douane</p>
              <p className="text-lg font-bold text-warning">{formatCurrency(totals.totalCustoms)}</p>
            </div>
            <div className="text-center p-3 bg-card/60 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">📊 Taxes ({globalTaxRate}%)</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(totals.totalTax)}</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-lg shadow-md border-2 border-primary/30">
              <p className="text-xs font-bold text-primary mb-1">💵 TOTAL TTC</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totals.grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Articles - Scrollable */}
        <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
          <div className="relative px-6 pb-6">
            <div className="sticky top-6">
              <div className="h-[calc(100vh-7rem)] flex flex-col gap-4 bg-gradient-to-b from-background/80 to-muted/30 rounded-2xl shadow-sm border border-border/60 p-4">
                <div className="flex items-center justify-between flex-shrink-0">
                  <h2 className="text-xl font-semibold text-foreground">Articles ({items.length})</h2>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un article
                  </Button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="h-full space-y-4 pr-3 overflow-y-auto fancy-scroll">
                    {items.map((item) => {
                      const isExpanded = expandedItems.has(item.id);
                      const itemTotals = calculateItemTotals(item);

                      return (
                        <Card
                          key={item.id}
                          className="border-2 hover:border-primary/50 transition-all shadow-md hover:shadow-lg bg-gradient-to-br from-card to-card/50"
                        >
                          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="mt-1">{getItemIcon(item.itemType)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      {item.itemType}
                                    </Badge>
                                    <code className="text-xs text-muted-foreground">{item.partNumber}</code>
                                  </div>
                                  <h3 className="font-semibold text-foreground text-lg">{item.designation}</h3>
                                  {!isExpanded && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 p-3 bg-muted/30 rounded-lg">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Quantité</p>
                                        <p className="text-sm font-medium text-foreground">
                                          {item.quantity} {item.unit}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Prix unitaire HT</p>
                                        <p className="text-sm font-medium text-accent">
                                          {formatCurrency(itemTotals.sellingPrice / item.quantity)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Prix total HT</p>
                                        <p className="text-sm font-medium text-success">
                                          {formatCurrency(itemTotals.sellingPrice)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Prix total TTC</p>
                                        <p className="text-base font-bold text-primary">
                                          {formatCurrency(itemTotals.sellingPriceInclTax)}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleItem(item.id)}>
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          {isExpanded && (
                            <CardContent className="pt-0">
                              <Separator className="mb-4" />

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                                    📝 Informations de saisie
                                  </h4>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs">Quantité</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                                        }
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Unité</Label>
                                      <Input
                                        value={item.unit}
                                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs">💱 Devise</Label>
                                    <Select
                                      value={item.priceCurrency}
                                      onValueChange={(value) => updateItem(item.id, { priceCurrency: value })}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="XOF">XOF</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label className="text-xs">💸 Prix d'achat unitaire (devise)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.costUnitForeign}
                                      onChange={(e) =>
                                        updateItem(item.id, { costUnitForeign: parseFloat(e.target.value) || 0 })
                                      }
                                      className="mt-1 border-destructive/50"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs text-warning">💸 Remise fournisseur (%)</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={item.discountRate || 0}
                                        onChange={(e) =>
                                          updateItem(item.id, { discountRate: parseFloat(e.target.value) || 0 })
                                        }
                                        className="mt-1 border-warning/50 focus:border-warning"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-success">📊 Ma marge (%)</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={item.margin || 0}
                                        onChange={(e) => updateItem(item.id, { margin: parseFloat(e.target.value) || 0 })}
                                        className="mt-1 border-success/50 focus:border-success font-semibold"
                                      />
                                    </div>
                                  </div>

                                  {item.itemType === "product" && (
                                    <>
                                      <Separator />
                                      <div className="space-y-3 p-3 bg-accent/5 rounded-lg">
                                        <h5 className="font-medium text-sm text-accent flex items-center gap-2">
                                          🚢 Frais d'import
                                        </h5>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <Label className="text-xs">🚚 Transport ({rfq.baseCurrency})</Label>
                                            <Input
                                              type="number"
                                              min="0"
                                              step="100"
                                              value={item.transportCost || 0}
                                              onChange={(e) =>
                                                updateItem(item.id, { transportCost: parseFloat(e.target.value) || 0 })
                                              }
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs">🛃 Taux de douane (%)</Label>
                                            <Input
                                              type="number"
                                              min="0"
                                              max="100"
                                              step="0.1"
                                              value={item.customsDutyRate || 0}
                                              onChange={(e) =>
                                                updateItem(item.id, { customsDutyRate: parseFloat(e.target.value) || 0 })
                                              }
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {item.itemType === "subscription" && (
                                    <>
                                      <Separator />
                                      <div className="space-y-3 p-3 bg-primary/5 rounded-lg">
                                        <h5 className="font-medium text-sm text-primary flex items-center gap-2">
                                          🔑 Licence / Abonnement
                                        </h5>

                                        <div className="flex items-center gap-4 mb-3">
                                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={item.isPerpetual || false}
                                              onChange={(e) => updateItem(item.id, { isPerpetual: e.target.checked })}
                                              className="rounded cursor-pointer"
                                            />
                                            Licence perpétuelle
                                          </label>
                                        </div>

                                        {!item.isPerpetual && (
                                          <>
                                            <div className="grid grid-cols-2 gap-3">
                                              <div>
                                                <Label className="text-xs">📅 Date début</Label>
                                                <Input
                                                  type="date"
                                                  value={item.periodStart || ""}
                                                  onChange={(e) => updateItem(item.id, { periodStart: e.target.value })}
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-xs">📅 Date fin</Label>
                                                <Input
                                                  type="date"
                                                  value={item.periodEnd || ""}
                                                  onChange={(e) => updateItem(item.id, { periodEnd: e.target.value })}
                                                  className="mt-1"
                                                />
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                              <div>
                                                <Label className="text-xs">🔄 Cycle de facturation</Label>
                                                <Select
                                                  value={item.billingCycleUnit || "month"}
                                                  onValueChange={(value) =>
                                                    updateItem(item.id, { billingCycleUnit: value })
                                                  }
                                                >
                                                  <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Cycle" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="day">Quotidien</SelectItem>
                                                    <SelectItem value="month">Mensuel</SelectItem>
                                                    <SelectItem value="year">Annuel</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div>
                                                <Label className="text-xs">💰 Prix récurrent</Label>
                                                <Input
                                                  type="number"
                                                  min="0"
                                                  step="0.01"
                                                  value={item.recurringPrice || 0}
                                                  onChange={(e) =>
                                                    updateItem(item.id, { recurringPrice: parseFloat(e.target.value) || 0 })
                                                  }
                                                  className="mt-1"
                                                />
                                              </div>
                                            </div>
                                            {item.setupFee !== undefined && (
                                              <div>
                                                <Label className="text-xs">⚡ Frais d'installation</Label>
                                                <Input
                                                  type="number"
                                                  min="0"
                                                  step="100"
                                                  value={item.setupFee}
                                                  onChange={(e) =>
                                                    updateItem(item.id, { setupFee: parseFloat(e.target.value) || 0 })
                                                  }
                                                  className="mt-1"
                                                />
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}

                                  <div>
                                    <Label className="text-xs">📋 Spécifications</Label>
                                    <Textarea
                                      value={item.specifications || ""}
                                      onChange={(e) => updateItem(item.id, { specifications: e.target.value })}
                                      className="mt-1 min-h-[60px]"
                                      placeholder="Spécifications techniques du produit..."
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">📝 Notes</Label>
                                    <Textarea
                                      value={item.notes || ""}
                                      onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                                      className="mt-1 min-h-[60px]"
                                      placeholder="Notes supplémentaires..."
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                                    💰 Calculs automatiques
                                  </h4>

                                  <Card className="bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-primary/20 shadow-md">
                                    <CardContent className="p-4 space-y-3">
                                      <div className="space-y-2 p-3 bg-card/60 rounded-lg">
                                        <h5 className="text-xs font-semibold text-destructive uppercase tracking-wide">
                                          📥 Prix d'achat
                                        </h5>

                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Prix unitaire (devise):</span>
                                          <span className="font-medium">
                                            {item.costUnitForeign} {item.priceCurrency}
                                          </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Prix unitaire ({rfq.baseCurrency}):</span>
                                          <span className="font-medium">{formatCurrency(itemTotals.costInLocalCurrency)}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Total achat brut:</span>
                                          <span className="font-medium">{formatCurrency(itemTotals.totalCost)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm text-warning">
                                          <span>💸 Remise fournisseur ({item.discountRate || 0}%):</span>
                                          <span className="font-medium">- {formatCurrency(itemTotals.supplierDiscount)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm font-semibold">
                                          <span>Total achat net:</span>
                                          <span>{formatCurrency(itemTotals.costAfterDiscount)}</span>
                                        </div>

                                        {item.itemType === "product" && (
                                          <>
                                            <Separator className="bg-accent/30" />

                                            {itemTotals.transportCost > 0 && (
                                              <div className="flex justify-between text-sm text-accent">
                                                <span>🚚 Transport:</span>
                                                <span className="font-medium">
                                                  + {formatCurrency(itemTotals.transportCost)}
                                                </span>
                                              </div>
                                            )}

                                            {itemTotals.customsDuty > 0 && (
                                              <div className="flex justify-between text-sm text-warning">
                                                <span>🛃 Douane ({item.customsDutyRate}%):</span>
                                                <span className="font-medium">
                                                  + {formatCurrency(itemTotals.customsDuty)}
                                                </span>
                                              </div>
                                            )}

                                            <div className="flex justify-between text-sm font-semibold text-destructive">
                                              <span>Total achat avec import:</span>
                                              <span>{formatCurrency(itemTotals.totalCostWithImport)}</span>
                                            </div>
                                          </>
                                        )}
                                      </div>

                                      <Separator className="bg-gradient-to-r from-destructive/30 via-success/30 to-destructive/30" />

                                      <div className="space-y-2 p-3 bg-card/60 rounded-lg">
                                        <h5 className="text-xs font-semibold text-success uppercase tracking-wide">
                                          📤 Prix de vente
                                        </h5>

                                        <div className="flex justify-between text-sm text-success">
                                          <span>📊 Ma marge ({itemTotals.marginRate}%):</span>
                                          <span className="font-semibold">+ {formatCurrency(itemTotals.marginAmount)}</span>
                                        </div>

                                        <Separator className="bg-success/20" />

                                        <div className="flex justify-between text-base font-bold text-accent">
                                          <span>Prix de vente HT:</span>
                                          <span>{formatCurrency(itemTotals.sellingPrice)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm text-primary">
                                          <span>📊 Taxe ({globalTaxRate}%):</span>
                                          <span className="font-medium">+ {formatCurrency(itemTotals.taxAmount)}</span>
                                        </div>

                                        <Separator className="bg-primary/30" />

                                        <div className="flex justify-between text-lg font-bold text-primary">
                                          <span>💵 Prix de vente TTC:</span>
                                          <span>{formatCurrency(itemTotals.sellingPriceInclTax)}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <div className="flex gap-2">
                                    <Button variant="destructive" size="sm" className="flex-1 gap-2 shadow-sm">
                                      <Trash2 className="h-3 w-3" />
                                      Supprimer l'article
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}

                    <Card className="border-2 border-muted shadow-sm">
                      <CardHeader className="bg-muted/20">
                        <CardTitle className="text-sm flex items-center gap-2">
                          📝 Notes internes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Textarea
                          defaultValue={rfq.internalNotes || ""}
                          className="min-h-[100px]"
                          placeholder="Notes internes non visibles par le client..."
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RFQDetails;















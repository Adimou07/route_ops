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
  requiresTransport?: boolean;
  requiresCustoms?: boolean;
}

const RFQDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [globalFxRate, setGlobalFxRate] = useState(600);
  const [items, setItems] = useState<RFQItem[]>(mockRFQDetails.items.map(item => ({
    ...item,
    margin: 10,
    requiresTransport: item.itemType === 'product',
    requiresCustoms: item.itemType === 'product'
  })));

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
    const marginAmount = costAfterDiscount * ((item.margin || 0) / 100);
    const sellingPrice = costAfterDiscount + marginAmount;
    
    return {
      costInLocalCurrency,
      totalCost,
      supplierDiscount,
      costAfterDiscount,
      marginAmount,
      sellingPrice,
      marginRate: item.margin || 0
    };
  };

  const calculateGlobalTotals = () => {
    let totalCost = 0;
    let totalSelling = 0;
    let totalMargin = 0;
    
    items.forEach(item => {
      const itemTotals = calculateItemTotals(item);
      totalCost += itemTotals.costAfterDiscount;
      totalSelling += itemTotals.sellingPrice;
      totalMargin += itemTotals.marginAmount;
    });
    
    const transport = rfq.freight || 0;
    const customs = rfq.customs || 0;
    totalCost += transport + customs;
    totalSelling += transport + customs;
    
    const taxRate = rfq.globalTaxRate || 0;
    const taxAmount = totalSelling * (taxRate / 100);
    const grandTotal = totalSelling + taxAmount;
    
    return {
      totalCost,
      totalSelling,
      totalMargin,
      marginRate: totalCost > 0 ? (totalMargin / totalCost) * 100 : 0,
      transport,
      customs,
      taxAmount,
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
      <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="p-6 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/rfq")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">{rfq.code}</h1>
                  <Badge variant={getStatusVariant(rfq.status)}>
                    {rfq.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Client: {rfq.customer.name} • Projet: {rfq.project?.title || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Exporter PDF
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Label className="text-xs text-muted-foreground">Taux de change global</Label>
              <Input 
                type="number" 
                value={globalFxRate} 
                onChange={(e) => setGlobalFxRate(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Totaux - Sticky */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b shadow-md p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Achat</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(totals.totalCost)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Marge</p>
              <p className="text-lg font-bold text-success">{formatCurrency(totals.totalMargin)}</p>
              <p className="text-xs text-success">({totals.marginRate.toFixed(1)}%)</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Sous-total Vente</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(totals.totalSelling)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Taxes ({rfq.globalTaxRate}%)</p>
              <p className="text-lg font-bold text-warning">{formatCurrency(totals.taxAmount)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Général</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totals.grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Articles - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Articles ({items.length})</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un article
            </Button>
          </div>

          {items.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);
            const itemTotals = calculateItemTotals(item);

            return (
              <Card key={item.id} className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getItemIcon(item.itemType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {item.itemType}
                          </Badge>
                          <code className="text-xs text-muted-foreground">{item.partNumber}</code>
                        </div>
                        <h3 className="font-semibold text-foreground">{item.designation}</h3>
                        {!isExpanded && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Qté: {item.quantity} {item.unit} • Marge: {item.margin}% • 
                            <span className="text-success font-medium ml-1">
                              {formatCurrency(itemTotals.sellingPrice)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItem(item.id)}
                      >
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
                      {/* Section Saisie */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                          📝 Informations de saisie
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Quantité</Label>
                            <Input 
                              type="number" 
                              value={item.quantity}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Unité</Label>
                            <Input 
                              value={item.unit}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Devise</Label>
                          <Select value={item.priceCurrency}>
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
                          <Label className="text-xs">Prix d'achat unitaire (devise)</Label>
                          <Input 
                            type="number" 
                            value={item.costUnitForeign}
                            className="mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Remise fournisseur (%)</Label>
                            <Input 
                              type="number" 
                              value={item.discountRate || 0}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Marge (%)</Label>
                            <Input 
                              type="number" 
                              value={item.margin || 0}
                              className="mt-1 border-success"
                            />
                          </div>
                        </div>

                        {item.itemType === 'subscription' && (
                          <>
                            <Separator />
                            <div className="space-y-3">
                              <h5 className="font-medium text-xs text-muted-foreground">Licence / Abonnement</h5>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">Date début</Label>
                                  <Input type="date" className="mt-1" />
                                </div>
                                <div>
                                  <Label className="text-xs">Date fin</Label>
                                  <Input type="date" className="mt-1" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">Cycle</Label>
                                  <Select>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Cycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="month">Mensuel</SelectItem>
                                      <SelectItem value="year">Annuel</SelectItem>
                                      <SelectItem value="day">Quotidien</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Prix récurrent</Label>
                                  <Input type="number" className="mt-1" />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {item.itemType === 'product' && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <h5 className="font-medium text-xs text-muted-foreground">Import</h5>
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-xs">
                                  <input type="checkbox" checked={item.requiresTransport} />
                                  Transport
                                </label>
                                <label className="flex items-center gap-2 text-xs">
                                  <input type="checkbox" checked={item.requiresCustoms} />
                                  Douane
                                </label>
                              </div>
                            </div>
                          </>
                        )}

                        <div>
                          <Label className="text-xs">Spécifications</Label>
                          <Textarea 
                            value={item.specifications || ''}
                            className="mt-1 min-h-[60px]"
                          />
                        </div>
                      </div>

                      {/* Section Calculs */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-accent flex items-center gap-2">
                          💰 Calculs automatiques
                        </h4>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Prix unitaire (devise):</span>
                              <span className="font-medium">{item.costUnitForeign} {item.priceCurrency}</span>
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
                              <span>Remise fournisseur ({item.discountRate || 0}%):</span>
                              <span className="font-medium">- {formatCurrency(itemTotals.supplierDiscount)}</span>
                            </div>

                            <div className="flex justify-between text-sm font-semibold">
                              <span>Total achat net:</span>
                              <span>{formatCurrency(itemTotals.costAfterDiscount)}</span>
                            </div>

                            <Separator className="bg-success/20" />

                            <div className="flex justify-between text-sm text-success">
                              <span>Marge ({itemTotals.marginRate}%):</span>
                              <span className="font-semibold">+ {formatCurrency(itemTotals.marginAmount)}</span>
                            </div>

                            <Separator className="bg-primary/20" />

                            <div className="flex justify-between text-base font-bold text-primary">
                              <span>Prix de vente total:</span>
                              <span>{formatCurrency(itemTotals.sellingPrice)}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Frais globaux */}
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-sm">Frais additionnels globaux</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Transport global</Label>
                <Input 
                  type="number" 
                  defaultValue={rfq.freight}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Douane globale</Label>
                <Input 
                  type="number" 
                  defaultValue={rfq.customs}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Taux de taxe global (%)</Label>
                <Input 
                  type="number" 
                  defaultValue={rfq.globalTaxRate}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notes internes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue={rfq.internalNotes || ''}
                className="min-h-[100px]"
                placeholder="Notes internes non visibles par le client..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default RFQDetails;

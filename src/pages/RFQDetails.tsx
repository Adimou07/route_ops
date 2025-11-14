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
  Calculator,
  ChevronDown,
  ChevronUp,
  ChevronsDownUp,
  ChevronsUpDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { mockRFQDetails } from "@/data/mockData";

const RFQDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [allExpanded, setAllExpanded] = useState(false);

  // Simuler le chargement des données
  const rfq = mockRFQDetails;

  const toggleItem = (itemId: number) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAllItems = () => {
    if (allExpanded) {
      setExpandedItems([]);
    } else {
      setExpandedItems(rfq.items.map(item => item.id));
    }
    setAllExpanded(!allExpanded);
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

  const calculateLineTotal = (item: any) => {
    const basePrice = item.unitPriceForeign * item.quantity * item.priceFxToBase;
    const discount = item.discountRate 
      ? basePrice * (item.discountRate / 100)
      : item.discountAmount || 0;
    return basePrice - discount;
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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

        {/* Recap Section - Totaux - STICKY */}
        <Card className="border-primary/20 bg-primary/5 sticky top-0 z-10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Récapitulatif Financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Achat HT</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(rfq.totals.costTotal, rfq.baseCurrency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Vente HT</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(rfq.totals.subtotalExcl, rfq.baseCurrency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Remise ({rfq.totals.weightedAvgDiscountRate.toFixed(2)}%)</p>
                <p className="text-xl font-bold text-orange-600">
                  -{formatCurrency(rfq.totals.lineDiscountTotal, rfq.baseCurrency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">TVA ({rfq.globalTaxRate}%)</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(rfq.totals.taxTotal, rfq.baseCurrency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total TTC Client</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(rfq.totals.grandTotal, rfq.baseCurrency)}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Marge Nette</p>
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(rfq.totals.marginAmount, rfq.baseCurrency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taux de Marge</p>
                <p className="text-2xl font-semibold text-green-600">
                  {rfq.totals.marginRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RFQ General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date RFQ</Label>
                <Input type="date" value={rfq.rfqDate} />
              </div>
              <div className="space-y-2">
                <Label>Date Limite Réponse</Label>
                <Input type="date" value={rfq.responseDeadline} />
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={rfq.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Basse</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Devise de Base</Label>
                <Input value={rfq.baseCurrency} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Taux de Change Global</Label>
                <Input type="number" value={rfq.fxFeePct} />
              </div>
              <div className="space-y-2">
                <Label>Incoterm</Label>
                <Input value={rfq.incoterm} />
              </div>
              <div className="space-y-2">
                <Label>Conditions de Paiement</Label>
                <Input value={rfq.paymentTerms} />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Notes</Label>
                <Textarea value={rfq.notes} rows={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles ({rfq.items.length})</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleAllItems}
                  className="gap-2"
                >
                  {allExpanded ? (
                    <>
                      <ChevronsDownUp className="h-4 w-4" />
                      Tout Replier
                    </>
                  ) : (
                    <>
                      <ChevronsUpDown className="h-4 w-4" />
                      Tout Déplier
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  Ajouter un Article
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {rfq.items.map((item) => {
              const isExpanded = expandedItems.includes(item.id);
              const lineTotal = calculateLineTotal(item);
              
              return (
                <Card key={item.id} className="border-2">
                  <CardContent className="pt-6">
                    {/* Desktop Layout - Two Columns */}
                    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
                      {/* Left Column - Inputs */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline">{item.itemType}</Badge>
                          <span className="text-sm text-muted-foreground">#{item.displayOrder}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Désignation *</Label>
                          <Input value={item.designation} />
                        </div>

                        <div className="space-y-2">
                          <Label>Part Number / Référence Produit</Label>
                          <Input value={item.partNumber || ""} placeholder="Ex: SW-24P-POE+" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantité</Label>
                            <Input type="number" value={item.quantity} />
                          </div>
                          <div className="space-y-2">
                            <Label>Unité</Label>
                            <Input value={item.unit} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Spécifications</Label>
                          <Textarea value={item.specifications} rows={2} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Prix Achat Unit. ({item.priceCurrency})</Label>
                            <Input type="number" value={item.costUnitForeign} className="text-red-600 font-semibold" />
                          </div>
                          <div className="space-y-2">
                            <Label>Prix Vente Unit. ({item.priceCurrency})</Label>
                            <Input type="number" value={item.unitPriceForeign} className="text-green-600 font-semibold" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Taux de Change vers {rfq.baseCurrency}</Label>
                          <Input type="number" value={item.priceFxToBase} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Remise (%)</Label>
                            <Input type="number" value={item.discountRate || 0} />
                          </div>
                          <div className="space-y-2">
                            <Label>Référence Fournisseur</Label>
                            <Input value={item.supplierRef || ""} placeholder="Optionnel" />
                          </div>
                        </div>

                        {item.itemType === 'product' && (
                          <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="space-y-2">
                              <Label className="text-xs">Transport</Label>
                              <Input type="number" defaultValue={0} placeholder="0" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Douane</Label>
                              <Input type="number" defaultValue={0} placeholder="0" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Calculations */}
                      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Calculator className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">Calculs Automatiques</h3>
                        </div>

                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-red-700 dark:text-red-400">ACHAT</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Prix Unit. ({rfq.baseCurrency})</span>
                                <span className="font-semibold text-red-600">
                                  {formatCurrency(item.costUnitForeign * item.priceFxToBase, rfq.baseCurrency)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Total Achat</span>
                                <span className="font-bold text-red-600">
                                  {formatCurrency(item.costUnitForeign * item.quantity * item.priceFxToBase, rfq.baseCurrency)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-green-700 dark:text-green-400">VENTE</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Prix Unit. ({rfq.baseCurrency})</span>
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(item.unitPriceForeign * item.priceFxToBase, rfq.baseCurrency)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Montant Brut</span>
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(item.unitPriceForeign * item.quantity * item.priceFxToBase, rfq.baseCurrency)}
                                </span>
                              </div>
                              {item.discountRate && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Remise ({item.discountRate}%)</span>
                                  <span className="font-semibold text-orange-600">
                                    -{formatCurrency(
                                      (item.unitPriceForeign * item.quantity * item.priceFxToBase * item.discountRate) / 100,
                                      rfq.baseCurrency
                                    )}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-sm font-medium">Total Vente HT</span>
                                <span className="font-bold text-green-600">
                                  {formatCurrency(lineTotal, rfq.baseCurrency)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-4 bg-primary/10 rounded border-2 border-primary/20">
                            <span className="font-semibold">Marge Ligne</span>
                            <span className="text-xl font-bold text-primary">
                              {formatCurrency(
                                lineTotal - (item.costUnitForeign * item.quantity * item.priceFxToBase),
                                rfq.baseCurrency
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout - Collapsible */}
                    <div className="lg:hidden space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.itemType}</Badge>
                          <span className="text-sm text-muted-foreground">#{item.displayOrder}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Désignation *</Label>
                          <Input value={item.designation} />
                        </div>

                        <div className="space-y-2">
                          <Label>Part Number</Label>
                          <Input value={item.partNumber || ""} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantité</Label>
                            <Input type="number" value={item.quantity} />
                          </div>
                          <div className="space-y-2">
                            <Label>Unité</Label>
                            <Input value={item.unit} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Prix Achat</Label>
                            <Input type="number" value={item.costUnitForeign} className="text-red-600" />
                          </div>
                          <div className="space-y-2">
                            <Label>Prix Vente</Label>
                            <Input type="number" value={item.unitPriceForeign} className="text-green-600" />
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Calculations */}
                      <Collapsible open={isExpanded} onOpenChange={() => toggleItem(item.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              Voir les Calculs
                            </span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                              <span className="text-sm font-medium">Total Achat</span>
                              <span className="font-bold text-red-600">
                                {formatCurrency(item.costUnitForeign * item.quantity * item.priceFxToBase, rfq.baseCurrency)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                              <span className="text-sm font-medium">Total Vente HT</span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(lineTotal, rfq.baseCurrency)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                              <span className="text-sm font-semibold">Marge</span>
                              <span className="font-bold text-primary">
                                {formatCurrency(
                                  lineTotal - (item.costUnitForeign * item.quantity * item.priceFxToBase),
                                  rfq.baseCurrency
                                )}
                              </span>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default RFQDetails;

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiService, Product, Category } from '@/lib/api';
import Container from '@/components/Container';

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Cargar datos
  const loadData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories()
      ]);

      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (err) {
      setError('Error al cargar los datos.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Funciones de productos
  const handleCreateProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price, // Keep as string
        stock: parseInt(productForm.stock),
        category_id: productForm.category_id ? parseInt(productForm.category_id) : undefined,
        image_url: productForm.image_url || undefined,
        is_active: true
      };

      await apiService.createProduct(productData);
      await loadData();
      setIsDialogOpen(false);
      resetProductForm();
      alert('Producto creado exitosamente');
    } catch (err) {
      alert('Error al crear producto');
      console.error('Error:', err);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price, // Keep as string
        stock: parseInt(productForm.stock),
        category_id: productForm.category_id ? parseInt(productForm.category_id) : undefined,
        image_url: productForm.image_url || undefined
      };

      await apiService.updateProduct(editingProduct.id, productData);
      await loadData();
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetProductForm();
      alert('Producto actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar producto');
      console.error('Error:', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await apiService.deleteProduct(id);
      await loadData();
      alert('Producto eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar producto');
      console.error('Error:', err);
    }
  };

  const handleUpdateStock = async (id: number, newStock: number) => {
    const currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    const quantity = newStock - currentProduct.stock;
    const reason = `Ajuste manual de stock`;

    try {
      await apiService.updateStock(id, quantity, reason);
      await loadData();
      alert('Stock actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar stock');
      console.error('Error:', err);
    }
  };

  // Funciones de categorías
  const handleCreateCategory = async () => {
    try {
      await apiService.createCategory(categoryForm);
      await loadData();
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      alert('Categoría creada exitosamente');
    } catch (err) {
      alert('Error al crear categoría');
      console.error('Error:', err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await apiService.updateCategory(editingCategory.id, categoryForm);
      await loadData();
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      alert('Categoría actualizada exitosamente');
    } catch (err) {
      alert('Error al actualizar categoría');
      console.error('Error:', err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

    try {
      await apiService.deleteCategory(id);
      await loadData();
      alert('Categoría eliminada exitosamente');
    } catch (err) {
      alert('Error al eliminar categoría');
      console.error('Error:', err);
    }
  };

  // Funciones de formulario
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image_url: ''
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: ''
    });
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        category_id: product.category_id?.toString() || '',
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      resetProductForm();
    }
    setIsDialogOpen(true);
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setIsCategoryDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona productos y categorías</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Sección de Categorías */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Categorías ({categories.length})</CardTitle>
                <CardDescription>Gestiona las categorías de productos</CardDescription>
              </div>
              <Button onClick={() => openCategoryDialog()}>
                Crear Categoría
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          ID: {category.id}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCategoryDialog(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sección de Productos */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Productos ({products.length})</CardTitle>
                <CardDescription>Gestiona el inventario de productos</CardDescription>
              </div>
              <Button onClick={() => openProductDialog()}>
                Crear Producto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-600 line-clamp-1">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${product.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newStock = prompt('Nuevo stock:', product.stock.toString());
                              if (newStock !== null) {
                                handleUpdateStock(product.id, parseInt(newStock));
                              }
                            }}
                          >
                            Ajustar
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category_name && (
                          <Badge variant="secondary">{product.category_name}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openProductDialog(product)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog para Producto */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Crear Producto'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modifica los datos del producto' : 'Agrega un nuevo producto al inventario'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descripción del producto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Precio</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={productForm.category_id}
                  onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">URL de Imagen</label>
                <Input
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  disabled={!productForm.name || !productForm.price || !productForm.stock}
                >
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Categoría */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoría' : 'Crear Categoría'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Modifica los datos de la categoría' : 'Agrega una nueva categoría'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Nombre de la categoría"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Descripción de la categoría"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  disabled={!categoryForm.name}
                >
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </Button>
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default AdminPage;

'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createCampaign } from '@/lib/firebase/firestore';
import { uploadCompressedImage } from '@/lib/firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { getCurrentUserId } from '@/lib/firebase/auth';

interface CreateCampaignPageProps {
  onNavigate: (page: string) => void;
}

export default function CreateCampaignPage({ onNavigate }: CreateCampaignPageProps) {
  const [vendorStatus, setVendorStatus] = useState<'pending' | 'active' | 'rejected' | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discount: '',
    stock: '',
    category: 'Électronique',
    delivery: 'Livraison gratuite à Douala et Yaoundé',
    location: 'Douala, Cameroun',
    duration: '24',
    startDate: '',
    endDate: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Vérifier le statut du vendeur au chargement
  useEffect(() => {
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    const vendorId = getCurrentUserId();
    if (!vendorId) {
      setVendorStatus(null);
      setCheckingStatus(false);
      return;
    }

    try {
      const { getVendorProfile } = await import('@/lib/firebase/firestore');
      const result = await getVendorProfile(vendorId);
      
      if (result.success && result.vendor) {
        setVendorStatus(result.vendor.status);
      } else {
        setVendorStatus(null);
      }
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      setVendorStatus(null);
    }
    
    setCheckingStatus(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 5) {
        setError('Maximum 5 images autorisées');
        return;
      }

      // Créer les previews
      const newPreviews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      setImages([...images, ...files]);
      setError('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setDuration = (hours: string) => {
    const now = new Date();
    const end = new Date(now.getTime() + parseInt(hours) * 60 * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      duration: hours,
      startDate: now.toISOString().slice(0, 16),
      endDate: end.toISOString().slice(0, 16)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validation
      if (images.length === 0) {
        throw new Error('Veuillez ajouter au moins une image');
      }

      const originalPrice = parseFloat(formData.originalPrice);
      const discount = parseFloat(formData.discount);
      const stock = parseInt(formData.stock);

      if (isNaN(originalPrice) || isNaN(discount) || isNaN(stock)) {
        throw new Error('Veuillez vérifier les valeurs numériques');
      }

      if (discount < 0 || discount > 100) {
        throw new Error('La réduction doit être entre 0 et 100%');
      }

      if (stock < 1) {
        throw new Error('Le stock doit être au moins 1');
      }

      // Upload des images avec compression
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        setUploadProgress(((i + 1) / images.length) * 100);
        const result = await uploadCompressedImage(images[i], 'campaigns', 1920, 0.8);
        
        if (!result.success || !result.url) {
          throw new Error(`Erreur lors de l'upload de l'image ${i + 1}`);
        }
        
        imageUrls.push(result.url);
      }

      // Calculer le prix actuel
      const currentPrice = originalPrice * (1 - discount / 100);

      // Obtenir l'ID du vendeur
      const vendorId = getCurrentUserId();
      if (!vendorId) {
        throw new Error('Vous devez être connecté');
      }

      // Créer la campagne
      const campaignData = {
        title: formData.title,
        description: formData.description,
        originalPrice,
        currentPrice,
        discount,
        stock,
        sold: 0,
        category: formData.category,
        images: imageUrls,
        delivery: formData.delivery,
        location: formData.location,
        vendorId,
        status: 'pending' as const, // En attente de validation admin
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        endDate: Timestamp.fromDate(new Date(formData.endDate)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const result = await createCampaign(campaignData);
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la création');
      }

      setSuccess(true);
      setStep(4);
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      console.error('Erreur création campagne:', err);
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description)) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (step === 2 && images.length === 0) {
      setError('Veuillez ajouter au moins une image');
      return;
    }
    if (step === 3 && (!formData.originalPrice || !formData.discount || !formData.stock)) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Vérification du statut */}
        {checkingStatus ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p>Vérification de votre statut...</p>
          </div>
        ) : vendorStatus === 'pending' ? (
          <div className="text-center py-12 bg-bg-medium rounded-xl p-8 border-2 border-yellow">
            <div className="text-8xl mb-6">⏳</div>
            <h2 className="text-2xl font-bold mb-4">Demande en cours de validation</h2>
            <p className="text-gray-medium mb-6 max-w-md mx-auto">
              Votre demande de partenariat est en cours de validation par notre équipe.
              <br /><br />
              Vous pourrez créer des campagnes dès que votre compte sera validé (généralement sous 24-48h).
            </p>
            <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
              Retour au dashboard
            </Button>
          </div>
        ) : vendorStatus === 'rejected' ? (
          <div className="text-center py-12 bg-bg-medium rounded-xl p-8 border-2 border-red">
            <div className="text-8xl mb-6">❌</div>
            <h2 className="text-2xl font-bold mb-4">Demande rejetée</h2>
            <p className="text-gray-medium mb-6">
              Votre demande de partenariat a été rejetée.
              <br /><br />
              Contactez notre support à support@flashdeals.cm pour plus d'informations.
            </p>
            <Button variant="secondary" onClick={() => onNavigate('landing')}>
              Retour
            </Button>
          </div>
        ) : vendorStatus !== 'active' ? (
          <div className="text-center py-12 bg-bg-medium rounded-xl p-8 border-2 border-gray-700">
            <div className="text-8xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
            <p className="text-gray-medium mb-6">
              Vous devez d'abord devenir partenaire pour créer des campagnes.
            </p>
            <Button variant="primary" onClick={() => onNavigate('signup')}>
              Devenir partenaire
            </Button>
          </div>
        ) : (
          <>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Infos', 'Images', 'Prix', 'Confirmation'].map((label, index) => (
              <div
                key={label}
                className={`flex-1 text-center ${
                  step > index + 1 ? 'text-green-500' : step === index + 1 ? 'text-orange' : 'text-gray-500'
                }`}
              >
                <div className="text-sm font-semibold">{label}</div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-bg-medium rounded-xl p-6">
          {/* Step 1: Informations de base */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Informations de base</h2>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Titre de la campagne</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-lg focus:border-orange focus:outline-none"
                  rows={4}
                  placeholder="Décrivez votre produit en détail..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-lg focus:border-orange focus:outline-none"
                  required
                >
                  <option value="Électronique">Électronique</option>
                  <option value="Mode">Mode</option>
                  <option value="Maison">Maison</option>
                  <option value="Beauté">Beauté</option>
                  <option value="Sport">Sport</option>
                  <option value="Alimentation">Alimentation</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Localisation</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Douala, Cameroun"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Images */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Images du produit</h2>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">
                  Ajouter des images (max 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Les images seront automatiquement compressées pour un chargement rapide
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Prix et stock */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Prix et disponibilité</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold">Prix original (FCFA)</label>
                  <Input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="Ex: 500000"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Réduction (%)</label>
                  <Input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Ex: 30"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              {formData.originalPrice && formData.discount && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <p className="text-sm">Prix final:</p>
                  <p className="text-2xl font-bold text-green-500">
                    {(parseFloat(formData.originalPrice) * (1 - parseFloat(formData.discount) / 100)).toLocaleString()} FCFA
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Stock disponible</label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ex: 50"
                  min="1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Livraison</label>
                <Input
                  name="delivery"
                  value={formData.delivery}
                  onChange={handleInputChange}
                  placeholder="Ex: Livraison gratuite à Douala"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Durée de la campagne</label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {['24', '48', '72'].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setDuration(hours)}
                      className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                        formData.duration === hours
                          ? 'bg-orange border-orange'
                          : 'bg-bg-dark border-gray-700 hover:border-orange'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold">Date de début</label>
                  <Input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Date de fin</label>
                  <Input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="text-center py-8">
              {uploading ? (
                <>
                  <div className="text-4xl mb-4">⏳</div>
                  <h3 className="text-2xl font-bold mb-4">Création en cours...</h3>
                  <div className="w-full bg-gray-800 rounded-full h-4 mb-4">
                    <div
                      className="bg-orange h-4 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-gray-400">Upload des images: {Math.round(uploadProgress)}%</p>
                </>
              ) : success ? (
                <>
                  <div className="text-6xl mb-6">✅</div>
                  <h3 className="text-2xl font-bold mb-4">Campagne créée !</h3>
                  <p className="text-gray-400 mb-6">
                    Votre campagne sera validée par un administrateur sous 2-4h et publiée automatiquement.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => onNavigate('campaigns')}
                    className="w-full"
                  >
                    Voir mes campagnes
                  </Button>
                </>
              ) : null}
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                  disabled={uploading}
                >
                  Retour
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  className="flex-1"
                >
                  Continuer →
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={uploading}
                >
                  {uploading ? 'Création...' : 'Créer la campagne'}
                </Button>
              )}
            </div>
          )}
        </form>
          </>
        )}
      </div>
    </div>
  );
}

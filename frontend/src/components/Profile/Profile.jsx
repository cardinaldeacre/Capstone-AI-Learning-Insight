import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { updateUser } from '@/lib/api/services/userService';
import SimpleAvatar from './SimpleAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'; 
import { Loader2, Save, User, Mail, Briefcase, Key, Edit, X } from 'lucide-react';
import { toast } from 'sonner';

// --- Sub-Komponen: Formulir Edit ---
function UpdateProfileForm({ user, onCancel, onSaveSuccess }) {
    const { reloadUserData } = useAuth();
    
    const [name, setName] = useState(user?.name || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setName(user?.name || '');
    }, [user?.name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const updateData = {}; 
            let changesMade = false;
            
            // 1. Append Nama
            if (name && name !== user.name) {
                updateData.name = name;
                changesMade = true;
            }
            
            // 2. Append Kata Sandi
            if (oldPassword && newPassword) {
               
                updateData.old_password = oldPassword; 
                updateData.new_password = newPassword;
                changesMade = true;
            } else if (oldPassword || newPassword) {
                throw new Error('Harap isi kedua field Kata Sandi (Lama & Baru) jika ingin mengubah sandi.');
            }

            if (!changesMade) {
                toast.info('Tidak ada perubahan data untuk disimpan.');
                setIsLoading(false);
                return;
            }
            const response = await updateUser(user.id, updateData); 
            
            if (reloadUserData) {
                
                await reloadUserData();
            }

            toast.success(response.message || 'Profil berhasil diperbarui!');
            
            
            setOldPassword('');
            setNewPassword('');
            onSaveSuccess(); 
            

        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Gagal memperbarui profil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Edit Informasi</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Anda"
                        className="h-10"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email (Tidak Dapat Diubah)</Label>
                    <Input
                        id="email"
                        type="email"
                        value={user.email}
                        className="h-10 bg-gray-100" 
                        disabled={true}
                        readOnly={true}
                    />
                </div>
            </div>

            <Separator className="my-6"/>

            {/* Password Update Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Perbarui Kata Sandi
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="old-password">Kata Sandi Lama</Label>
                        <Input
                            id="old-password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Wajib diisi untuk ganti sandi"
                            className="h-10"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Kata Sandi Baru</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Wajib diisi untuk ganti sandi"
                            className="h-10"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    Error: {error}
                </div>
            )}

            <div className="flex justify-end pt-4 space-x-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="mr-2 size-4" />
                    Batal
                </Button>
                <Button type="submit" disabled={isLoading || (oldPassword && !newPassword) || (newPassword && !oldPassword)}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Simpan Perubahan
                </Button>
            </div>
        </form>
    );
}

// --- Komponen Utama Profil ---
export default function Profile() {
    const { auth } = useAuth();
    const user = auth.user;
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        return <div className="text-center py-10">Memuat data profil...</div>;
    }
    
    const roleColors = {
        'admin': 'bg-red-500',
        'teacher': 'bg-blue-500',
        'student': 'bg-teal-500'
    };
    const roleColor = roleColors[user.role] || 'bg-gray-500';

    return (
        <div className="space-y-6">
            <header className="pb-4 border-b">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Profil Saya
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    {user.role === 'admin' ? 'Pengaturan Akun Administrator' : `Detail akun ${user.role} Anda.`}
                </p>
            </header>

            <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader className="flex flex-row justify-between items-start">
                    <CardTitle className="text-2xl font-semibold">
                       {isEditing ? 'Mode Edit Profil' : 'Informasi Akun'}
                    </CardTitle>
                    {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 size-4" />
                            Edit Profil
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {!isEditing ? (
                        /* VIEW MODE */
                        <div className="space-y-6">
                            {/* Avatar and Role */}
                            <div className="flex items-center space-x-6 pb-4 border-b">
                                <SimpleAvatar username={user.name} size={96} />
                                <div className="space-y-1">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${roleColor}`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                    <h3 className="text-3xl font-bold text-gray-900">{user.name}</h3>
                                </div>
                            </div>

                            {/* Details Table/List */}
                            <div className="space-y-4">
                                
                                <div className="flex items-center space-x-4 border-b pb-3">
                                    <Mail className="size-5 text-teal-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg font-medium text-gray-800">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 border-b pb-3">
                                    <User className="size-5 text-teal-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                                        <p className="text-lg font-medium text-gray-800">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Key className="size-5 text-teal-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Kata Sandi</p>
                                        <p className="text-lg font-medium text-gray-800">***********</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* EDIT MODE */
                        <UpdateProfileForm
                            user={user}
                            onCancel={() => setIsEditing(false)}
                            onSaveSuccess={() => setIsEditing(false)}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
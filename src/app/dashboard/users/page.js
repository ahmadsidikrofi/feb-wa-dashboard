'use client'


import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Plus, Users, Shield, Lock } from 'lucide-react';
import api from '@/lib/axios';
import AddUser from '@/components/Users/add-user';

const ROLES = ['admin', 'dekanat', 'kaprodi', 'dosen', 'kaur', 'mahasiswa'];

const ROLE_CONFIG = {
    admin: { color: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400', label: 'Administrator', icon: '🔐' },
    dekanat: { color: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400', label: 'Dekanat', icon: '🏛️' },
    kaprodi: { color: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400', label: 'Kaprodi', icon: '👨‍🎓' },
    dosen: { color: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400', label: 'Dosen', icon: '👨‍🎓' },
    kaur: { color: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400', label: 'Kaur', icon: '📋' },
    mahasiswa: { color: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400', label: 'mahasiswa', icon: '🧑' },
}


const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingDetailId, setEditingDetailId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'kaur',
    })

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenDialog = (user) => {
        if (user) {
            setEditingId(user.id);
            setFormData({
                name: user.name,
                username: user.username,
                password: user.password,
                role: user.role,
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', username: '', password: '', role: 'Kaur' });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ name: '', username: '', password: '', role: 'Kaur' });
    }

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/users')
            setUsers(res.data.users)
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleSubmit = () => {
        if (!formData.name || !formData.username || !formData.password) {
            alert('Semua field harus diisi')
            return;
        }

        if (editingId) {
            setUsers(
                users.map((user) =>
                    user.id === editingId
                        ? { ...user, ...formData }
                        : user
                )
            );
        }
        handleCloseDialog();
    }

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            setUsers(users.filter((user) => user.id !== id));
        }
    }

    const handleSaveUserDetail = (updatedUser) => {
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        setEditingDetailId(null);
    };

    //   if (editingDetailId) {
    //     const editingUser = users.find((u) => u.id === editingDetailId);
    //     if (editingUser) {
    //       return (
    //         <UserEditDetail
    //           user={editingUser}
    //           onSave={handleSaveUserDetail}
    //           onGoBack={() => setEditingDetailId(null)}
    //         />
    //       );
    //     }
    //   }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
                            <p className="text-muted-foreground mt-1">Kelola pengguna sistem dengan mudah dan aman</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Total User</p>
                                <p className="text-3xl font-bold">{users.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    {ROLES.map((role) => (
                        <Card key={role} className="border-border/40 bg-card/40 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">{ROLE_CONFIG[role].label}</p>
                                    <p className="text-3xl font-bold">{users.filter((u) => u.role === role).length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex-1">
                        <div className="relative">
                            <Input
                                placeholder="Cari user berdasarkan nama, username, atau role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-4 pr-10 h-11 bg-card/40 backdrop-blur-sm border-border/40"
                            />
                        </div>
                    </div>
                    <AddUser onSuccess={fetchUsers} roles={ROLES} role_config={ROLE_CONFIG} />
                </div>

                {/* User Grid */}
                <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                        <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                            <CardContent className="py-12">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <Users className="w-12 h-12 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        {searchQuery ? 'Tidak ada user yang sesuai dengan pencarian' : 'Belum ada user terdaftar'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredUsers.map((user) => (
                                <Card key={user.id} className="border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 h-fit">
                                                    <Lock className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold truncate">{user.name}</h3>
                                                    <div className="flex flex-col sm:flex-row gap-3 mt-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Lock className="w-4 h-4" />
                                                            <span className="truncate">{user.username}</span>
                                                        </div>
                                                        <div className="text-xs">
                                                            {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${ROLE_CONFIG[user.role]?.color || ROLE_CONFIG['kaur'].color}`}>
                                                            {ROLE_CONFIG[user.role]?.icon} {ROLE_CONFIG[user.role]?.label || user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 sm:flex-col">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(user)}
                                                    className="gap-2 flex-1 sm:flex-none bg-transparent hover:bg-primary/10 dark:hover:bg-primary/20"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Ubah</span>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="gap-2 flex-1 sm:flex-none"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Hapus</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog - Only for Editing now */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg border-border/40 bg-gradient-to-b from-card to-card/80 backdrop-blur-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Ubah Data User
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold block mb-2">Nama Lengkap</label>
                            <Input
                                placeholder="Masukkan nama lengkap"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-secondary/50 border-border/40 h-10"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold block mb-2">Username</label>
                            <Input
                                placeholder="Masukkan username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="bg-secondary/50 border-border/40 h-10"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold block mb-2">Password</label>
                            <Input
                                type="password"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-secondary/50 border-border/40 h-10"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold block mb-2">Role</label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger className="bg-secondary/50 border-border/40 h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-border/40">
                                    {ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {ROLE_CONFIG[role].icon} {ROLE_CONFIG[role].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={handleCloseDialog} className="flex-1 bg-transparent hover:bg-secondary/50">
                                Batal
                            </Button>
                            <Button onClick={handleSubmit} className="flex-1">
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UsersPage
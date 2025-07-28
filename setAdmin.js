const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pizza-nostra-e54da-default-rtdb.europe-west1.firebasedatabase.app"
});

const setAdminClaims = async (uid) => {
  try {
    // 1. Definir claims
    await admin.auth().setCustomUserClaims(uid, { 
      admin: true,
      role: 'admin',
      level: 10,
      lastAdminUpdate: new Date().toISOString()
    });

    // 2. Forçar refresh do token
    await admin.auth().revokeRefreshTokens(uid);

    // 3. Verificar resultado
    const user = await admin.auth().getUser(uid);
    console.log('✅ Claims atualizadas:', user.customClaims);
    
    // 4. Gerar novo token (opcional)
    const token = await admin.auth().createCustomToken(uid);
    console.log('\n🔑 Token de desenvolvimento:', token);
    
    return { success: true, uid, claims: user.customClaims };
  } catch (error) {
    console.error('❌ Erro:', error);
    return { success: false, error: error.message };
  }
};

// Execute para seu usuário
setAdminClaims('6BhRDWKuWuY6zViAzb0fLZc4M0i2')
  .then(result => process.exit(result.success ? 0 : 1));
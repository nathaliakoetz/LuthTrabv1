import express from 'express';
import cors from 'cors';
import marcasRoutes from './routes/marcas';
import produtosRoutes from './routes/produtos';
import fotosRoutes from './routes/fotos';
import clientesRoutes from './routes/clientes';
import propostasRoutes from './routes/propostas';
import clientePropostasRoutes from './routes/clientePropostas'; 
import adminsRoutes from './routes/admins';
import dashboardRoutes from './routes/dashboard'

const app = express();
const port = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Registre suas rotas
app.use("/marcas", marcasRoutes);
app.use("/produtos", produtosRoutes);
app.use("/fotos", fotosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/propostas", propostasRoutes);
app.use("/minhas-propostas", clientePropostasRoutes);
app.use("/admins", adminsRoutes);
app.use("/dashboard", dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API: Ecommerce Music Store');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});

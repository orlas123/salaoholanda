

document.addEventListener('DOMContentLoaded', () => {
    // Seu código JavaScript aqui

    const loginButton = document.getElementById('loginButton');
    const storeContainer = document.getElementById('storeContainer');
    const loginContainer = document.getElementById('loginContainer');
    const userNameSpan = document.getElementById('userName');
    const profileNameSpan = document.getElementById('profileName');
    const profileNumberSpan = document.getElementById('profileNumber');
    const orderCodeSpan = document.getElementById('orderCode');

    const cartItemsList = document.getElementById('cartItems');
    const totalAmountSpan = document.getElementById('totalAmount');
    const cartCountSpan = document.getElementById('cartCount');
    let totalAmount = 0;
    let cartCount = 0;

    loginButton.addEventListener('click', () => {
        const nome = document.getElementById('nome').value;
        const numero = document.getElementById('numero').value;
        if (nome && numero) {
            userNameSpan.textContent = nome; 
            profileNameSpan.textContent = nome;
            profileNumberSpan.textContent = numero;
            loginContainer.style.display = 'none';
            storeContainer.style.display = 'block';
        } else {
            alert("Por favor, preencha ambos os campos: Nome e Número.");
        }
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const product = productElement.getAttribute('data-product');
            const price = parseFloat(productElement.getAttribute('data-price'));
            const image = productElement.getAttribute('data-image');

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${image}" alt="${product}" style="width: 138px; height: 130px;"> 
                ${product} - ${price}₣ 
                <div class="quantity-controls">
                    <button class="decrease">➖</button>
                    <span class="quantity">1</span>
                    <button class="increase">➕</button>
                    <button class="remove">🗑️</button>
                </div>`;
            
            cartItemsList.appendChild(listItem);

            const decreaseButton = listItem.querySelector('.decrease');
            const increaseButton = listItem.querySelector('.increase');
            const quantitySpan = listItem.querySelector('.quantity');
            const removeButton = listItem.querySelector('.remove');

            decreaseButton.addEventListener('click', () => {
                let quantity = parseInt(quantitySpan.textContent);
                if (quantity > 1) {
                    quantity--;
                    quantitySpan.textContent = quantity;
                    updateTotal();
                }
            });

            increaseButton.addEventListener('click', () => {
                let quantity = parseInt(quantitySpan.textContent);
                quantity++;
                quantitySpan.textContent = quantity;
                updateTotal();
            });

            removeButton.addEventListener('click', () => {
                cartItemsList.removeChild(listItem);
                cartCount--;
                cartCountSpan.textContent = cartCount;
                updateTotal();
            });

            totalAmount += price;
            totalAmountSpan.textContent = totalAmount.toFixed(2);
            cartCount++;
            cartCountSpan.textContent = cartCount;
        });
    });

    function updateTotal() {
        totalAmount = 0;
        cartItemsList.querySelectorAll('li').forEach(item => {
            const price = parseFloat(item.innerText.split('-')[1].split('₣')[0].trim());
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            totalAmount += price * quantity;
        });
        totalAmountSpan.textContent = totalAmount.toFixed(2);
    }

    document.getElementById('checkoutButton').addEventListener('click', () => {
        if (cartCount === 0) {
            alert("O carrinho está vazio! Adicione produtos antes de finalizar a compra.");
            return;
        }

        // Gerar código de pedido
        const orderCode = Math.floor(Math.random() * 10000);
        orderCodeSpan.textContent = orderCode;
        document.getElementById('orderConfirmation').style.display = 'block';

        // Armazenar informações do último pedido
        const lastCustomerData = {
            nome: profileNameSpan.textContent,
            numero: profileNumberSpan.textContent,
            produtos: Array.from(cartItemsList.children).map(item => {
                const productName = item.innerText.split('-')[0].trim();
                const productImage = item.querySelector('img').src; // Captura a imagem
                return { name: productName, image: productImage };
            }),
            orderCode: orderCode
        };

        // Atualizar painel do vendedor
        document.getElementById('lastCustomerName').innerText = lastCustomerData.nome;
        document.getElementById('lastCustomerNumber').innerText = lastCustomerData.numero;
        const lastPurchasedProducts = document.getElementById('lastPurchasedProducts');
        lastPurchasedProducts.innerHTML = ''; // Limpa produtos anteriores
        lastCustomerData.produtos.forEach(product => {
            const productItem = document.createElement('div');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
                ${product.name}`;
            lastPurchasedProducts.appendChild(productItem);
        });
        document.getElementById('lastOrderCode').innerText = lastCustomerData.orderCode;

        // Limpar o carrinho
        cartItemsList.innerHTML = '';
        totalAmount = 0;
        cartCount = 0;
        totalAmountSpan.textContent = '0.00';
        cartCountSpan.textContent = '0';
        document.getElementById('products').style.display = 'grid';
        document.getElementById('cart').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
    });

    // Função para mostrar a seção de produtos
    function showProducts() {
        document.getElementById('products').style.display = 'grid';
        document.getElementById('cart').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('sellerPanel').style.display = 'none'; // Ocultar painel do vendedor
    }

    // Eventos para mostrar as seções
    document.getElementById('cartLink').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('cart').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('products').style.display = 'none';
        document.getElementById('sellerPanel').style.display = 'none'; // Ocultar painel do vendedor
    });

    document.getElementById('profileLink').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('profile').style.display = 'block';
        document.getElementById('cart').style.display = 'none';
        document.getElementById('products').style.display = 'none';
        document.getElementById('sellerPanel').style.display = 'none'; // Ocultar painel do vendedor
    });
     // Evento para voltar ao painel principal
     document.getElementById('homeLink').addEventListener('click', (event) => {
        event.preventDefault();
        showProducts();
    });

    // Evento para mostrar a seção do painel do vendedor
    document.getElementById('sellerPanelLink').addEventListener('click', (event) => {
        event.preventDefault();
        // Ocultar todas as seções
        document.getElementById('cart').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('products').style.display = 'none';
        document.getElementById('sellerPanel').style.display = 'block'; // Mostrar o painel do vendedor
    });

    // Modal para imagens
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.getElementsByClassName("close")[0];

    document.querySelectorAll('.product img').forEach((img) => {
        img.addEventListener('click', function() {
            modal.style.display = "block"; // Mostra o modal
            modalImage.src = this.src; // Define a imagem no modal
            captionText.innerHTML = this.alt; // Define a legenda no modal
        });
    });

    closeBtn.onclick = function() {
        modal.style.display = "none"; // Oculta o modal
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none"; // Oculta o modal
        }
    }
});

// Obter referências aos elementos do modal
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('caption');
const closeButton = document.getElementsByClassName('close')[0];

// Adicionar evento de clique aos produtos para exibir o modal
const productImages = document.querySelectorAll('.imgprodoct');
productImages.forEach(image => {
    image.addEventListener('click', () => {
        modalImage.src = image.src;
        modalCaption.textContent = image.alt;
        imageModal.style.display = 'block';
    });
});

// Adicionar evento de clique no botão de fechar
closeButton.addEventListener('click', () => {
    imageModal.style.display = 'none';
});

// Adicionar evento de clique fora do modal para fechá-lo
window.addEventListener('click', (event) => {
    if (event.target == imageModal) {
        imageModal.style.display = 'none';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const installPrompt = document.getElementById('install-prompt');
    const installButton = document.getElementById('install-button');
    const closeButton = document.getElementById('close-button');

    let deferredPrompt; // Armazena o evento de instalação

    // Função para mostrar o prompt de instalação
    const showInstallPrompt = () => {
        installPrompt.style.display = 'block';
    };

    // Função para lidar com o clique do botão de instalação
    const handleInstallClick = () => {
        if (deferredPrompt) {
            // Mostra o prompt de instalação nativo do navegador
            deferredPrompt.prompt();

            // Aguarda a resposta do usuário
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação');
                } else {
                    console.log('Usuário recusou a instalação');
                }
                deferredPrompt = null; // Limpa o evento
            });
        }
    };

    // Função para fechar o prompt
    const handleCloseClick = () => {
        installPrompt.style.display = 'none'; // Esconde o prompt após o fechamento
    };

    // Listener de evento para o botão de instalação
    installButton.addEventListener('click', handleInstallClick);

    // Listener de evento para o botão de fechar
    closeButton.addEventListener('click', handleCloseClick);

    // Captura o evento de instalação
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Previne o prompt automático
        deferredPrompt = e; // Armazena o evento para uso posterior
        showInstallPrompt(); // Exibe o prompt personalizado
    });

    // Exemplo de quando mostrar o prompt de instalação
    // Isso poderia ser baseado em condições específicas em seu aplicativo
    setTimeout(showInstallPrompt, 2000); // Exibe o prompt após 2 segundos como demonstração
});

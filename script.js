document.getElementById('generate-pdf').addEventListener('click', function () {
    const imgBase64 = base64Image;
    const investigados = document.getElementById('investigados').value;
    const crimeEmApuracao = document.getElementById('crime-em-apuracao').value;
    const provasComplementares = document.getElementById('provas-complementares').value;
    const relatorioDosFatos = document.getElementById('relatorio-dos-fatos').value;
    const justificativaBuscaApreensao = document.getElementById('justificativa-busca-apreensao').value;
    const fundamentacaoLegal = document.getElementById('fundamentacao-legal').value;
    const justificativaMandadoPrisoes = document.getElementById('justificativa-mandado-prisao').value;
    const garantiaOrdemPublica = document.getElementById('garantia-ordem-publica').value;
    const interrupcaoNecessaria = document.getElementById('interrupcao-necessaria').value;
    const riscoReiteracaoDelitiva = document.getElementById('risco-reiteracao-delitiva').value;
    const conclusaoRequerimentos = document.getElementById('conclusao-requerimentos').value;  

    const imagensInputs = [
        document.getElementById('imagens1').files,
        document.getElementById('imagens2').files,
        document.getElementById('imagens3').files,
        document.getElementById('imagens4').files
    ];

    const videoLinks = [
        document.getElementById('video1').value,
        document.getElementById('video2').value,
        document.getElementById('video3').value
    ];

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPosition = 41;

    function checkAndAddPage(offset = 10) {
        if (yPosition + offset > 270) {
            doc.addPage();
            yPosition = 10;
        }
    }

    if (imgBase64) {
        doc.addImage(imgBase64, 'PNG', 85, 2, 40, 40);
    }

    function addHeader() {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text("ESTADO DE SÃO PAULO", 105, yPosition, { align: "center" });
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text("SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA", 105, yPosition, { align: "center" });
        yPosition += 6;

        doc.text("DELEGACIA GERAL DA POLÍCIA CIVIL 93º DELEGACIA", 105, yPosition, { align: "center" });
        yPosition += 6;

        doc.text("REGIONAL DE SÃO PAULO", 105, yPosition, { align: "center" });
        yPosition += 12; 
    }

    addHeader();

    function addSection(title, content) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title, 15, yPosition);
        yPosition += 6;

        const lines = doc.splitTextToSize(content, 180);
        doc.setFont('helvetica', 'normal');
        lines.forEach((line) => {
            checkAndAddPage(6);
            doc.text(line, 15, yPosition);
            yPosition += 6;
        });
        yPosition += 4;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const mainTitle = "PARECER SOBRE A NECESSIDADE DE PRODUÇÃO DE PROVAS ADICIONAIS E AUTORIZAÇÃO DE BUSCA E APREENSÃO E MANDADO DE PRISÃO.";
    const titleLines = doc.splitTextToSize(mainTitle, 180);
    titleLines.forEach((line) => {
        checkAndAddPage(6);
        doc.text(line, 15, yPosition);
        yPosition += 6;
    });
    yPosition += 4;

    addSection("INVESTIGADOS:", investigados);
    addSection("CRIME EM APURAÇÃO:", crimeEmApuracao);
    addSection("I. RELATÓRIO DOS FATOS:", relatorioDosFatos);
    addSection("II. JUSTIFICATIVA PARA A BUSCA E APREENSÃO:", justificativaBuscaApreensao);
    addSection("1. FUNDAMENTAÇÃO LEGAL PARA A BUSCA E APREENSÃO:", fundamentacaoLegal);
    addSection("2. PROVAS COMPLEMENTARES:", provasComplementares);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text("PROVAS (IMAGENS):", 15, yPosition);
    yPosition += 6;

    const imagePromises = [];
    let xPosition = 15;
    let maxColumns = 2;
    let imageCount = 0;

    imagensInputs.forEach((imagensInput) => {
        Array.from(imagensInput).forEach((file) => {
            const promise = new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const imgData = event.target.result;
                    const imgHeight = 60;
                    const imgWidth = 80;

                    doc.addImage(imgData, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
                    xPosition += imgWidth + 10;
                    imageCount++;

                    if (imageCount === maxColumns) {
                        xPosition = 15;
                        yPosition += imgHeight + 10;
                        imageCount = 0;
                        checkAndAddPage(imgHeight + 10);
                    }
                    resolve();
                };
                reader.readAsDataURL(file);
            });
            imagePromises.push(promise);
        });
    });


    Promise.all(imagePromises).then(() => {

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("VÍDEOS:", 15, yPosition);
        yPosition += 6;


        doc.setTextColor(0, 0, 255); 


        videoLinks.forEach((videoLink, index) => {
            if (videoLink) {
                doc.setFont('helvetica', 'bold');
                const videoLabel = `VIDEO ${index + 1} (Clique aqui para acessar)`;
                doc.text(videoLabel, 15, yPosition);
                doc.link(15, yPosition - 4, 180, 6, { url: videoLink });
                yPosition += 6;
            }
        });


        doc.setTextColor(0, 0, 0); 


        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("III. JUSTIFICATIVA PARA A SOLICITAÇÃO DE MANDADO DE PRISÃO PREVENTIVA:", 15, yPosition);
        yPosition += 6;


        doc.setFont('helvetica', 'normal');
        const justificativaLines = doc.splitTextToSize(justificativaMandadoPrisoes, 180);
        justificativaLines.forEach((line) => {
            checkAndAddPage(6);
            doc.text(line, 15, yPosition);
            yPosition += 6;
        });
        yPosition += 4;


        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("2. Garantia da Ordem Pública:", 15, yPosition); 
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const garantiaLines = doc.splitTextToSize(garantiaOrdemPublica, 180);
        garantiaLines.forEach((line) => {
            checkAndAddPage(6);
            doc.text(line, 15, yPosition);
            yPosition += 6;
        });
        yPosition += 4;


        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("3. Necessidade de Interromper a Atividade Investigatória:", 15, yPosition); 
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const interrupcaoLines = doc.splitTextToSize(interrupcaoNecessaria, 180);
        interrupcaoLines.forEach((line) => {
            checkAndAddPage(6);
            doc.text(line, 15, yPosition);
            yPosition += 6;
        });
        yPosition += 4;


        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("4. Risco de Reiteração Delitiva:", 15, yPosition); 
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const riscoLines = doc.splitTextToSize(riscoReiteracaoDelitiva, 180);
        riscoLines.forEach((line) => {
            checkAndAddPage(6);
            doc.text(line, 15, yPosition);
            yPosition += 6;
        });
        yPosition += 4;


        addSection("IV. CONCLUSÃO E REQUERIMENTOS:", conclusaoRequerimentos);


        doc.save('inqueritopc.pdf');
    });
});

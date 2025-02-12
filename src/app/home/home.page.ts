import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { IonContent, IonSlides, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    @ViewChild(IonContent, { static: true }) ionContent!: IonContent;
    @ViewChild(IonSlides, { static: false }) ionSlides!: IonSlides;
    @ViewChild('dadosFormRef', { static: false }) dadosFormRef!: NgForm;
    @ViewChild('enderecoFormRef', { static: false }) enderecoFormRef!: NgForm;
    @ViewChild('ministerioFormRef', { static: false }) ministerioFormRef!: NgForm;
    public dadosForm!: FormGroup;
    public enderecoForm!: FormGroup;
    public ministerioForm!: FormGroup;
    public pdfObj!: pdfMake.TCreatedPdf;
    public photoPreview!: string;
    private logoData!: string | ArrayBuffer | null;
    public urlPdf: string = '';
    public congregacao: string = '';
    public cpf: string = '';
    public nome: string = '';
    public dataNascimento: string = '';
    public sexo: string = '';
    public estadoCivil: string = '';
    public nacionalidade: string = '';
    public naturalidade: string = '';
    public uf: string = '';
    public email: string = '';
    public nomeMae: string = '';
    public nomePai: string = '';
    public escolaridade: string = '';
    public telefone1: string = '';
    public telefone2: string = '';
    public cep: string = '';
    public rua: string = '';
    public numero: string = '';
    public bairro: string = '';
    public complemento: string = '';
    public estado: string = '';
    public cidade: string = '';
    public batismoAgua: string = '';
    public batismoEspiritoSanto: string = '';
    public isObreiro: string = '';
    public obreiroCargo: string = '';
    public consDiacono: string = '';
    public localDiacono: string = '';
    public consPresbitero: string = '';
    public localPresbitero: string = '';
    public consEvangelista: string = '';
    public localEvangelista: string = '';
    public consPastor: string = '';
    public localPastor: string = '';
    public regCampo: string = '';
    public regCadesgo: string = '';
    public regCgadb: string = '';
    public currentSlide!: string;
    public slides!: string[];
    public isBeginning: boolean = true;
    public isEnd: boolean = false;
    public isEnabledBack: boolean = false;

    public slidesOpts = {
        allowTouchMove: false,
        autoHeight: true,
    };

    public strCongregacao = [
        {
            regional: 'REGIONAL 01',
            options: [
                {value: 'ANICUNS'},
                {value: 'ADELÂNDIA'},
                {value: 'AMERICANO DO BRASIL'},
                {value: 'SÃO DOMINGOS'},
                {value: 'SANTA FÉ'}
            ],
        },
        {
            regional: 'REGIONAL 02',
            options: [
                {value: 'RECANTO DO BOSQUE'},
                {value: 'ALICE BARBOSA'},
                {value: 'ITANHANGÁ'},
                {value: 'ALTO CERRADO'},
                {value: 'BOA VISTA'},
                {value: 'SÃO BERNARDO'},
                {value: '14 BIS'}
            ],
        },
        {
            regional: 'REGIONAL 03',
            options: [
                {value: 'JOÃO BRÁS'},
                {value: 'VILA FÁTIMA'},
                {value: 'NORTE FERROVIÁRIO'},
                {value: 'SÃO MARCOS'},
                {value: 'RESIDENCIAL PORTINARI'},
                {value: 'SETOR CAMPINAS'},
                {value: 'GOIANIRA (SERRA DOURADA)'}
            ],
        },
        {
            regional: 'REGIONAL 04',
            options: [
                {value: 'FAIÇALVILLE'},
                {value: 'VILA BOA'},
                {value: 'PEDRO LUDOVICO'},
                {value: 'VILA ROSA'},
                {value: 'SETOR DOS AFONSO'},
                {value: 'RESIDENCIAL ELI FORTE'}
            ],
        },
        {
            regional: 'REGIONAL 05',
            options: [
                {value: 'JARDIM TDS SANTOS 2'},
                {value: 'JARDIM TODOS OS SANTOS 3'},
                {value: 'PEDRO MIRANDA'},
                {value: 'RIO ARAGUAIA'},
                {value: 'FLOR DO YPÊ'}
            ],
        },
        {
            regional: 'REGIONAL 06',
            options: [
                {value: 'VEIGA JARDIM'},
                {value: 'CARDOSO II'},
                {value: 'BURITI SERENO'},
                {value: 'COLINA AZUL'},
                {value: 'TERRA DO SOL'}
            ],
        },
        {
            regional: 'REGIONAL 07',
            options: [
                {value: 'VILA ROMANA'},
                {value: 'JARDIM ITAIPU'},
                {value: 'GOIÂNIA SUL'},
                {value: 'BOA ESPERANÇA'},
                {value: 'JARDIM INDEPENDENCIA'}
            ],
        },
        {
            regional: 'REGIONAL 08',
            options: [
                {value: 'CROMINIA'},
                {value: 'ARAGOIÂNIA-GO'},
                {value: 'HIDROLÂNDIA'}
            ],
        },
        {
            regional: 'REGIONAL 09',
            options: [
                {value: 'BOFINÓPOLIS-GO'},
                {value: 'SETOR JULIANA (BOFINÓPOLIS-GO)'}
            ],
        },
        {
            regional: 'IGREJAS MISSIONÁRIAS',
            options: [
                {value: 'LONDRES'},
                {value: 'CONCÓRDIA-ARG. PROVINCIA DE ENTRE RIOS'},
                {value: 'ELDORADO-ARG'},
                {value: 'VERA CRUZ'},
                {value: 'MACAPÁ-AP (BRASIL NOVO)'},
                {value: 'FIN SOCIAL'}
            ],
        }
    ];

    public strSexo = [
        { nome: 'MASCULINO' },
        { nome: 'FEMININO' }
    ];

    public strEstadoCivil = [
        { nome: 'CASADO(a)' },
        { nome: 'SOLTEIRO(a)' },
        { nome: 'DIVORCIADO(a)' },
        { nome: 'VIÚVO(a)' }
    ]

    public strNacionalidade = [
        { nome: 'BRASILEIRO(a)' },
        { nome: 'ESTRANGEIRO(a)' }
    ]
    
    public strEstados = [
        { sigla: 'AC', nome: 'ACRE' },
        { sigla: 'AL', nome: 'ALAGOAS' },
        { sigla: 'AP', nome: 'AMAPÁ' },
        { sigla: 'AM', nome: 'AMAZONAS' },
        { sigla: 'BA', nome: 'BAHIA' },
        { sigla: 'CE', nome: 'CEARÁ' },
        { sigla: 'DF', nome: 'DISTRITO FEDERAL' },
        { sigla: 'ES', nome: 'ESPÍRITO SANTO' },
        { sigla: 'GO', nome: 'GOIÁS' },
        { sigla: 'MA', nome: 'MARANHÃO' },
        { sigla: 'MT', nome: 'MATO GROSSO' },
        { sigla: 'MS', nome: 'MATO GROSSO DO SUL' },
        { sigla: 'MG', nome: 'MINAS GERAIS' },
        { sigla: 'PA', nome: 'PARÁ' },
        { sigla: 'PB', nome: 'PARAÍBA' },
        { sigla: 'PR', nome: 'PARANÁ' },
        { sigla: 'PE', nome: 'PERNAMBUCO' },
        { sigla: 'PI', nome: 'PIAUÍ' },
        { sigla: 'RJ', nome: 'RIO DE JANEIRO' },
        { sigla: 'RN', nome: 'RIO GRANDE DO NORTE' },
        { sigla: 'RS', nome: 'RIO GRANDE DO SUL' },
        { sigla: 'RO', nome: 'RONDÔNIA' },
        { sigla: 'RR', nome: 'RORAIMA' },
        { sigla: 'SC', nome: 'SANTA CATARINA' },
        { sigla: 'SP', nome: 'SÃO PAULO' },
        { sigla: 'SE', nome: 'SERGIPE' },
        { sigla: 'TO', nome: 'TOCANTINS' }
    ];

    public strEscolaridade = [
        { nome: 'FUND. INCOMPLETO' },
        { nome: 'FUND. COMPLETO' },
        { nome: 'MÉDIO INCOMPLETO' },
        { nome: 'MÉDIO COMPLETO' },
        { nome: 'SUP. INCOMPLETO' },
        { nome: 'SUP. COMPLETO' },
        { nome: 'TECNÓLOGO' },
        { nome: 'PÓS-GRADUAÇÃO' },
        { nome: 'MESTRADO' },
        { nome: 'DOUTORADO' }
    ];

    public strObreiro = [
        { nome: 'SIM' },
        { nome: 'NAO' },
    ];

    constructor(public fb: FormBuilder, public plt: Platform, public http: HttpClient, public fileOpener: FileOpener) { }

    ngOnInit() {
        const slides = ['Dados Pessoais', 'Endereço', 'Ministério'];
        this.currentSlide = slides[0];
        this.slides = slides;
        this.currentSlide = slides[0];
        this.slides = slides;
        this.dadosForm = this.fb.group({
            congregacao: this.congregacao,
            cpf: this.cpf,
            nome: this.nome,
            dataNascimento: this.dataNascimento,
            sexo: this.sexo,
            estadoCivil: this.estadoCivil,
            nacionalidade: this.nacionalidade,
            naturalidade: this.naturalidade,
            uf: this.uf,
            email: this.email,
            nomeMae: this.nomeMae,
            nomePai: this.nomePai,
            escolaridade: this.escolaridade,
            telefone1: this.telefone1,
            telefone2: this.telefone2
        });

        this.enderecoForm = this.fb.group({
            cep: this.cep,
            rua: this.rua,
            numero: this.numero,
            bairro: this.bairro,
            complemento: this.complemento,
            estado: this.estado,
            cidade: this.cidade
        });

        this.ministerioForm = this.fb.group({
            batismoAgua: this.batismoAgua,
            batismoEspiritoSanto: this.batismoEspiritoSanto,
            isObreiro: this.isObreiro,
            obreiroCargo: this.obreiroCargo,
            consDiacono: this.consDiacono,
            localDiacono: this.localDiacono,
            consPresbitero: this.consPresbitero,
            localPresbitero: this.localPresbitero,
            consEvangelista: this.consEvangelista,
            localEvangelista: this.localEvangelista,
            consPastor: this.consPastor,
            localPastor: this.localPastor,
            regCampo: this.regCampo,
            regCadesgo: this.regCadesgo,
            regCgadb: this.regCgadb
        });


        this.loadLocalAssetToBase64();
    }
   
    onSlidesDidChange() {
        this.ionContent.scrollToTop();
    }

    onBackButtonTouched() {
        this.urlPdf = '';
        this.ionSlides.slidePrev();
        this.ionContent.scrollToTop();
    }

    onNextButtonTouched() {
        if (this.currentSlide === 'Dados Pessoais') {
            this.ionSlides.slideNext();
            this.ionContent.scrollToTop();
        } else if (this.currentSlide === 'Endereço') {
            this.ionSlides.slideNext();
            this.ionContent.scrollToTop();
        } else if (this.currentSlide === 'Ministério') {
            this.ionSlides.slideNext();
            this.ionContent.scrollToTop();
        }
    }

    async onSlidesChanged() {
        this.isEnabledBack = false;
        const index = await this.ionSlides.getActiveIndex();
        this.currentSlide = this.slides[index];
        this.isBeginning = await this.ionSlides.isBeginning();
        this.isEnd = await this.ionSlides.isEnd();
        if (this.isEnd) {
            this.isEnabledBack = true;
        }
    }

    loadLocalAssetToBase64() {
        this.http.get('./assets/images/header-igreja.png', { responseType: 'blob' })
            .subscribe(res => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.logoData = reader.result;
                }
                reader.readAsDataURL(res);
            });
    }

    async takePicture() {
        try {
            const image = await Camera.getPhoto({
                quality: 100,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera,
                promptLabelHeader: 'Custom Header Text',
                promptLabelPhoto: 'Custom Camera Text',
                promptLabelPicture: 'Custom Gallery Text'
            });

            this.photoPreview = `data:image/jpeg;base64,${image.base64String}`;
            this.urlPdf = '';
        } catch (error) {
            this.photoPreview = '';
            this.urlPdf = '';
            if (error instanceof Error) {
                console.log('Erro:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    createPdf() {
        let logo = { image: this.logoData, width: 450, alignment: 'center' };

        const content = [];

        // Verifica se this.photoPreview existe e é uma string não vazia
        if (this.photoPreview) {
            content.push({
                image: this.photoPreview ?? '',
                width: 98, // Largura da imagem
                height: 120, // Altura da imagem
                margin: [0, -120, 0, 0]
            });
        } else {
            content.push({
                text: 'Imagem não disponível',
                alignment: 'center',
                margin: [0, -50, 0, 0]
            });
        }

        const docDefinition: any = {
            header: {
                // Definindo o cabeçalho com uma moldura
                canvas: [
                    {
                        type: 'rect',
                        x: 30, // Margem esquerda
                        y: 35, // Margem superior
                        w: 535, // Largura da moldura (595 - 30 - 30)
                        h: 778, // Altura da moldura (842 - 32 - 32)
                        lineWidth: 3, // Espessura da linha
                        fill: 'none' // Sem preenchimento
                    }
                ],
                absolutePosition: { x: 0, y: 0 } // Posição absoluta para garantir que a moldura fique no fundo
            },
            watermark: { text: 'AD MISSÃO JARDIM AMÉRICA', color: 'red', opacity: 0.05, bold: true },
            content: [
                {
                    columns: [
                        logo
                    ]
                },

                { // Linha horizontal abaixo da imagem
                    canvas: [
                        {
                            type: 'line',
                            x1: 0,
                            y1: 0,
                            x2: 515, // largura da linha
                            y2: 0,
                            lineWidth: 1.5,
                            lineColor: 'black' // cor da linha
                        }
                    ],
                    margin: [0, 2, 0, 2] // margens em torno da linha
                },

                {
                    text: 'FICHA DE CADASTRO',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 5, 0, 5]
                },

                // Inicio dos Inputs table de cadastro
                {
                    columns: [
                        {
                            width: '80%', // Ajuste a largura conforme necessário
                            stack: [
                                {
                                    text: 'CONGREGAÇÃO',
                                    bold: true,
                                    margin: [0, 0, 0, 10]
                                },
                                {
                                    table: {
                                        widths: [380],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.congregacao.toUpperCase()
                                                }
                                            ]
                                        ]
                                    }
                                },
                                {
                                    text: 'Dados Pessoais',
                                    bold: true,
                                    margin: [0, 10, 0, 10]
                                },
                                {
                                    text: 'CPF',
                                    bold: true
                                },
                                {
                                    table: {
                                        widths: [380],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 5]
                                }
                            ]
                        },
                        // Quadrado da foto
                        {
                            width: '20%', // Ajuste a largura conforme necessário
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'rect',
                                            x: 0,
                                            y: 0,
                                            w: 98, // Largura do quadrado
                                            h: 120, // Altura do quadrado
                                            lineWidth: 1,
                                            lineColor: 'black',
                                            fill: 'none' // Sem preenchimento
                                        }
                                    ],
                                    margin: [0, 0, 0, 0] // Margem à direita do quadrado
                                },
                                // Variavel da imagem
                                content
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 0] // Margem em torno do conjunto de colunas
                },
                {
                    text: 'Nome',
                    bold: true
                },
                {
                    table: {
                        widths: [500],
                        heights: 13,
                        body: [
                            [
                                {
                                    text: this.nome.toUpperCase()
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '35%',
                            stack: [
                                { text: 'Data de Nascimento', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.dataNascimento.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '15%',
                            stack: [
                                { text: 'Masculino', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.sexo === 'MASCULINO' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '15%',
                            stack: [
                                { text: 'Feminino', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.sexo === 'FEMININO' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '34%',
                            stack: [
                                { text: 'Estado Civil', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.estadoCivil.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '20%',
                            stack: [
                                { text: 'Nacionalidade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.nacionalidade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '35%',
                            stack: [
                                { text: 'Naturalidade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.naturalidade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '10%',
                            stack: [
                                { text: 'UF', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.uf.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '34%',
                            stack: [
                                { text: 'E-mail', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.email.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '49.5%',
                            stack: [
                                { text: 'Nome Mãe', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.nomeMae.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '49.5%',
                            stack: [
                                { text: 'Nome Pai', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.nomePai.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '37%',
                            stack: [
                                { text: 'Escolaridade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.escolaridade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '31%',
                            stack: [
                                { text: 'Telefone 1', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.telefone1.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '31%',
                            stack: [
                                { text: 'Telefone 2', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.telefone2.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },

                { // Linha horizontal abaixo da imagem
                    canvas: this.createDottedLine(0, 0, 515, 0, 5),
                    margin: [0, 2, 0, 2] // margens em torno da linha
                },
                {
                    text: 'Endereço',
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                {
                    columns: [
                        {
                            width: '30%',
                            stack: [
                                { text: 'Cep', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.cep.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '49%',
                            stack: [
                                { text: 'Rua', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.rua.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '20%',
                            stack: [
                                { text: 'Número', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.numero.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '39.5%',
                            stack: [
                                { text: 'Bairro', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.bairro.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '59.5%',
                            stack: [
                                { text: 'Complemento', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.complemento.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '39.5%',
                            stack: [
                                { text: 'Estado', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.estado.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '59.5%',
                            stack: [
                                { text: 'Cidade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.cidade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },

                { // Linha horizontal abaixo da imagem
                    canvas: this.createDottedLine(0, 0, 515, 0, 5),
                    margin: [0, 2, 0, 2] // margens em torno da linha
                },
                {
                    text: 'Ministério',
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                {
                    columns: [
                        {
                            width: '21%',
                            stack: [
                                { text: 'Batismo nas águas:', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '27%',
                            stack: [
                                {
                                    text: this.batismoAgua.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 0, 0, 0]
                                },
                            ]
                        },
                        {
                            width: '28%',
                            stack: [
                                { text: 'Batismo no Espírito Santo:', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.batismoEspiritoSanto.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 0, 0, 0]
                                },
                            ]
                        },
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Obreiro?', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '5%',
                            bold: true,
                            stack: [
                                { text: 'Sim', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '8%',
                            stack: [
                                {
                                    table: {
                                        widths: [25],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.isObreiro === 'SIM' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '5%',
                            bold: true,
                            stack: [
                                { text: 'Não', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '20%',
                            stack: [
                                {
                                    table: {
                                        widths: [25],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.isObreiro === 'NÃO' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '8%',
                            bold: true,
                            stack: [
                                { text: 'Cargo:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '40.5%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.obreiroCargo.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Diácono', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consDiacono.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localDiacono.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Presbítero', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consPresbitero.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localPresbitero.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Evangelista', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consEvangelista.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localEvangelista.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Pastor', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consPastor.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localPastor.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 10]
                },
                {
                    columns: [
                        {
                            width: '33%',
                            stack: [
                                { text: 'Registro Campo Jd. América', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.regCampo.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '33%',
                            stack: [
                                { text: 'Registro CADESGO', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.regCadesgo.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '33.5%',
                            stack: [
                                { text: 'Registro CGADB', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.regCgadb.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    text: '(Continuação da Ficha de Cadastro para Obreiros e Membros da IEADMM-Jd. América.....Fl 02)',
                    decoration: 'underline',
                    bold: true,
                    margin: [0, 10, 0, 10] // Margens em torno do texto 
                },

                { text: 'DECLARAÇÃO E TERMO DE AUTORIZAÇÃO', style: 'header', alignment: 'center' },

                { text: 'I – DÍZIMOS, OFERTAS E DOAÇÕES', style: 'header', margin: [0, 30, 0, 10] },

                {
                    text: `Pelo presente termo, eu acima identificado, declaro para os devidos fins e a quem possa interessar que as contribuições como os dízimos, as ofertas e outras doações feitas por mim à Igreja Evangélica Assembleia de Deus Ministério Missão – Jardim América, são voluntárias, e que em hipótese alguma, nem no presente e no futuro, reclamarei a devolução do que por mim foi doado.`,
                    alignment: 'justify',
                    fontSize: 14,
                    margin: [0, 10, 0, 10]
                },

                { text: 'II – USO DE IMAGEM, VOZ E CESSÃO DE DIREITO', style: 'header', margin: [0, 30, 0, 10] },

                {
                    text: `Declaro ainda, com base no art. 29 da Lei de Direitos Autorais, que AUTORIZO de forma gratuita e sem qualquer ônus, a Igreja Evangélica Assembleia de Deus Ministério Missão – Jardim América, a utilização de minha(s) imagem(ns) e/ou voz e/ou de informações pessoais na obra, e em sua divulgação, se houver, em todos os meios de divulgação possíveis, quer sejam na mídia impressa (livros, catálogos, revistas, jornais, entre outros), televisiva (propagandas para televisão aberta e/ou fechas, vídeos, filmes, entre outros), radiofônica (programas de rádio/podcasts), internet, banco de dados informatizados, multimídia, entre outros, e nos meios de comunicação interna, como jornais e periódicos em geral, na forma de impresso, voz e imagem.`,
                    alignment: 'justify',
                    fontSize: 14,
                    margin: [0, 10, 0, 10]
                },

                {
                    text: `A presente autorização e cessão são de natureza gratuita, firmadas em caráter irrevogável e irretratável e por prazo indeterminado, cujos direitos e obrigações vinculam seus respectivos herdeiros e sucessores consoante as regras previstas na Lei 9.610/98 (Lei sobre Direitos Autorais e outras providências).`,
                    alignment: 'justify',
                    fontSize: 14,
                    margin: [0, 10, 0, 80]
                },
                {
                    columns: [
                        {
                            width: '30%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 154,
                                            y2: 0,
                                            lineWidth: 1,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '2%',
                            stack: [
                                { text: ',', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '8%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 35,
                                            y2: 0,
                                            lineWidth: 1,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '3%',
                            stack: [
                                { text: 'de', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '20%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 100,
                                            y2: 0,
                                            lineWidth: 1,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '3%',
                            stack: [
                                { text: 'de', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '10%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 50,
                                            y2: 0,
                                            lineWidth: 1,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 60]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            alignment: 'center',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 200,
                                            y2: 0,
                                            lineWidth: 1,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '50%',
                            alignment: 'center',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 200,
                                            y2: 0,
                                            lineWidth: 1,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 0]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            alignment: 'center',
                            stack: [
                                { text: 'OBREIRO/MEMBRO', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '50%',
                            alignment: 'center',
                            stack: [
                                { text: 'DIRIGENTE/SECRETÁRIO', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                    ],
                    margin: [0, 0, 0, 0]
                },
                
            ],

            // Rodapé
            footer(currentPage: any, pageCount: any) {
                return {
                    columns: [
                        { text: 'APP a1000ton Tecnologia - Todos os direitos reservados Copyright' + ' | ' + new Date().toLocaleString(), alignment: 'center', fontSize: 6 }
                    ]
                };
            },
            styles: {
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 0]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 0]
                }
            }
        }
        this.urlPdf = '';
        this.pdfObj = pdfMake.createPdf(docDefinition);
        setTimeout(async () => {
            await this.pdfObj.getBuffer(async (buffer) => {
                const blob = new Blob([buffer], { type: 'application/pdf' });
                this.urlPdf = URL.createObjectURL(blob);
            });
        }, 100);
    }

    downloadPdf() {
        if (this.plt.is('cordova')) {
            this.pdfObj.getBase64(async (data) => {
                try {
                    let path = `pdf/myletter_${Date.now()}.pdf`;

                    const result = await Filesystem.writeFile({
                        path,
                        data: data,
                        directory: Directory.Documents,
                        recursive: true
                        // encoding: Encoding.UTF8
                    });
                    this.fileOpener.open(`${result.uri}`, 'application/pdf');

                } catch (e) {
                    console.error('Unable to write file', e);
                }
            });
        } else {
            const newTab = window.open(this.urlPdf, '_blank');
            if (newTab) {
                newTab.focus();
            } else { // O bloqueador de pop-ups pode estar ativo
                alert('Por favor, permita pop-ups para visualizar o PDF.');
            }
        }
    }

    // Função para criar uma linha pontilhada
    createDottedLine(x1: number, y1: number, x2: number, y2: number, dashLength: number) {
        const lines = [];
        const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const dashCount = Math.floor(totalLength / dashLength);

        for (let i = 0; i < dashCount; i++) {
            const startX = x1 + (x2 - x1) * (i / dashCount);
            const startY = y1 + (y2 - y1) * (i / dashCount);
            const endX = x1 + (x2 - x1) * ((i + 0.5) / dashCount);
            const endY = y1 + (y2 - y1) * ((i + 0.5) / dashCount);

            lines.push({
                type: 'line',
                x1: startX,
                y1: startY,
                x2: endX,
                y2: endY,
                lineWidth: 1.5,
                lineColor: 'black'
            });
        }
        return lines;
    }

}
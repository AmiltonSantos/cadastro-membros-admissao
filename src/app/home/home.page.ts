import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { IonContent, IonSlides, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

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
    private urlPdf!: string;
    public congregacao: string = '';
    public cpf: string = '';
    public nome: string = '';
    public dataNascimento: string = '00/00/0000';
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
    public batismoAgua: string = '00/00/0000';
    public batismoEspiritoSanto: string = '00/00/000';
    public obreiroSim: string = '';
    public obreiroNao: string = '';
    public obreiroCargo: string = '';
    public consDiacono: string = '00/00/0000';
    public localDiacono: string = '';
    public consPresbitero: string = '00/00/0000';
    public localPresbitero: string = '';
    public consEvangelista: string = '00/00/0000';
    public localEvangelista: string = '';
    public consPastor: string = '00/00/0000';
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

    constructor(public fb: FormBuilder, public plt: Platform, public http: HttpClient, public fileOpener: FileOpener) { }

    ngOnInit() {
        const slides = ['Dados Pessoais', 'Endereço', 'Ministério'];
        this.currentSlide = slides[0];
        this.slides = slides;
        this.currentSlide = slides[0];
        this.slides = slides;
        this.dadosForm = this.fb.group({
            showLogo: true,
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
            obreiroSim: this.obreiroSim,
            obreiroNao: this.obreiroNao,
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

    ngAfterViewInit() {
        // Aguarda a visualização ser inicializada antes de adicionar os ouvintes
        const footer = document.querySelector('ion-footer');
        const inputField = document.querySelector('input');

        if (inputField && footer) {
            inputField.addEventListener('focus', () => {
                // Ajusta a altura do footer quando o teclado é aberto
                footer.style.position = 'absolute';
                footer.style.bottom = '300px'; // Ajuste conforme a altura do teclado
            });

            inputField.addEventListener('blur', () => {
                // Restaura a posição original do footer quando o teclado é fechado
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
            });
        }
    }

    onSlidesDidChange() {
        this.ionContent.scrollToTop();
    }

    onBackButtonTouched() {
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
    }

    createPdf() {
        const formvalue = this.dadosForm.value;
        const image = this.photoPreview ? { image: this.photoPreview, width: 300, alignment: 'left' } : {};

        let logo = {};
        if (formvalue.showLogo) {
            logo = { image: this.logoData, width: 450, alignment: 'center' }
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
                    text: 'CONGREGAÇÃO',
                    bold: true
                },
                {
                    table: {
                        widths: [380],
                        heights: 13,
                        body: [
                            [
                                {
                                    text: this.congregacao
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
                                    text: this.cpf
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 5]
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
                                    text: this.nome
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
                                                    text: this.dataNascimento
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
                                                    text: this.sexo
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
                                                    text: this.sexo
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
                                                    text: this.estadoCivil
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
                                                    text: this.nacionalidade
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
                                                    text: this.naturalidade
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
                                                    text: this.uf
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
                                                    text: this.email
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
                                                    text: this.nomeMae
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
                                                    text: this.nomePai
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
                                                    text: this.escolaridade
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
                                                    text: this.telefone1
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
                                                    text: this.telefone2
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
                                                    text: this.cep
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
                                                    text: this.rua
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
                                                    text: this.numero
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
                                                    text: this.bairro
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
                                                    text: this.complemento
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
                                                    text: this.estado
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
                                                    text: this.cidade
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
                                    text: this.batismoAgua,
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
                                    text: this.batismoEspiritoSanto,
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
                                                    text: this.obreiroSim
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
                                                    text: this.obreiroNao
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
                                                    text: this.obreiroCargo
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
                                    text: this.consDiacono,
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
                                                    text: this.localDiacono
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
                                    text: this.consPresbitero,
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
                                                    text: this.localPresbitero
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
                                    text: this.consEvangelista,
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
                                                    text: this.localEvangelista
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
                                    text: this.consPastor,
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
                                                    text: this.localPastor
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
                                                    text: this.regCampo
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
                                                    text: this.regCadesgo
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
                                                    text: this.regCgadb
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

                // The potentially captured image!
                image
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
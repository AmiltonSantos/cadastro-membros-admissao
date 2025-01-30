import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonicSafeString, Platform } from '@ionic/angular';
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
export class HomePage implements OnInit {

    myForm!: FormGroup;
    pdfObj!: pdfMake.TCreatedPdf;
    photoPreview!: string;
    logoData!: string | ArrayBuffer | null;
    urlPdf!: string;

    constructor(private fb: FormBuilder, private plt: Platform, private http: HttpClient, private fileOpener: FileOpener) { }

    ngOnInit() {
        this.myForm = this.fb.group({
            showLogo: true,
            from: 'Carl',
            to: 'Henning',
            text: 'This is sample text.'
        });

        this.loadLocalAssetToBase64();
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
        const formvalue = this.myForm.value;
        const image = this.photoPreview ? { image: this.photoPreview, width: 300, alignment: 'left' } : {};

        let logo = {};
        if (formvalue.showLogo) {
            logo = { image: this.logoData, width: 450, alignment: 'center' }
        }

        const docDefinition: any = {
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
                    margin: [0, 10, 0, 10]
                },

                // Inicio dos Inputs table de cadastro
                {
                    text: 'CONGREGAÇÃO',
                    bold: true
                },
                {
                    table: {
                        widths: [380],
                        body: [
                            ['Column 1']
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
                        body: [
                            ['Column 1']
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
                        body: [
                            ['Column 1']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col3']
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
                                        body: [
                                            ['Col4']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col3']
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
                                        body: [
                                            ['Col4']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                { text: 'Batismo nas águas ', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '27%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 120, 
                                            y2: 0,
                                            lineWidth: 1.5,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '28%',
                            stack: [
                                { text: 'Batismo no Espírito Santo', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 120, 
                                            y2: 0,
                                            lineWidth: 1.5,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 12, 0, 0]
                                }
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
                                        body: [
                                            ['Col4']
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
                                        body: [
                                            ['Col4']
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
                                        body: [
                                            ['Col4']
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
                            width: '12%',
                            bold: true,
                            stack: [
                                { text: 'Data Início', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 120, 
                                            y2: 0,
                                            lineWidth: 1.5,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 15, 0, 0]
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
                            width: '43%',                            
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        body: [
                                            ['Col4']
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
                            width: '12%',
                            bold: true,
                            stack: [
                                { text: 'Data Início', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 120, 
                                            y2: 0,
                                            lineWidth: 1.5,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 15, 0, 0]
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
                            width: '43%',                            
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        body: [
                                            ['Col4']
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
                            width: '12%',
                            bold: true,
                            stack: [
                                { text: 'Data Início', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 120, 
                                            y2: 0,
                                            lineWidth: 1.5,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 15, 0, 0]
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
                            width: '43%',                            
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        body: [
                                            ['Col4']
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
                            width: '12%',
                            bold: true,
                            stack: [
                                { text: 'Data Início', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 0,
                                            x2: 120, 
                                            y2: 0,
                                            lineWidth: 1.5,
                                            lineColor: 'black'
                                        }
                                    ],
                                    margin: [0, 15, 0, 0]
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
                            width: '43%',                            
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        body: [
                                            ['Col4']
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
                                        body: [
                                            ['Col1']
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
                                        body: [
                                            ['Col2']
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
                                        body: [
                                            ['Col2']
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
		        '(Continuação da Ficha de Cadastro para Obreiros e Membros da IEADMM-Jd. América..............Fl 02)',
                {text: 'DECLARAÇÃO E TERMO DE AUTORIZAÇÃO', style: 'header'},

                // The potentially captured image!
                image,

                // Adicionando a moldura como um canvas
                {
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
                }
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
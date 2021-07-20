import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EcoFabSpeedDialModule} from '@ecodev/fab-speed-dial';
import {OrderModule} from '../admin/order/order.module';
import {ProfileModule} from '../profile/profile.module';
import {ArtisansModule} from '../shared/modules/artisans.module';
import {MaterialModule} from '../shared/modules/material.module';
import {AperoDivestComponent} from './components/agir-avec-nous/apero-divest/apero-divest.component';
import {CommentListComponent} from './components/comment-list/comment-list.component';
import {DonationComponent} from './components/donation/donation.component';
import {EventPageComponent} from './components/event-page/event-page.component';
import {EventsPageComponent} from './components/events-page/events-page.component';
import {HomeBlockComponent} from './components/home-block/home-block.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {LoginComponent} from './components/login/login.component';
import {MenuComponent} from './components/menu/menu.component';
import {NewsPageComponent} from './components/news-page/news-page.component';
import {NewsesPageComponent} from './components/newses-page/newses-page.component';
import {SessionsIncomingComponent} from './components/sessions-incoming/sessions-incoming.component';
import {SessionFacilitatorComponent} from './components/session-facilitator/session-facilitator.component';
import {SessionMethodComponent} from './components/session-method/session-method.component';
import {SessionOrganisationComponent} from './components/session-organisation/session-organisation.component';
import {SessionPageComponent} from './components/session-page/session-page.component';
import {FrontOfficeRoutingModule} from './front-office-routing.module';
import {FrontOfficeComponent} from './front-office.component';
import {ShopModule} from './modules/shop/shop.module';
import {SessionSideColumnComponent} from './components/session-side-column/session-side-column.component';
import {ConvictionsComponent} from './components/association/convictions/convictions.component';
import {QuiSommesNousComponent} from './components/association/qui-sommes-nous/qui-sommes-nous.component';
import {ComiteStatusComponent} from './components/association/comite-status/comite-status.component';
import {PartenariatsComponent} from './components/association/partenariats/partenariats.component';
import {ContactComponent} from './components/contact/contact.component';
import {ProjetComponent} from './components/projet/projet.component';
import {PointsDeVenteComponent} from './components/points-de-vente/points-de-vente.component';
import {ActionsComponent} from './components/agir-avec-nous/actions/actions.component';
import {CalculerEmpreinteCarboneComponent} from './components/agir-avec-nous/calculer-empreinte-carbone/calculer-empreinte-carbone.component';
import {DesinvestirFossileComponent} from './components/agir-avec-nous/desinvestir-fossile/desinvestir-fossile.component';
import {NumeriqueEthiqueComponent} from './components/agir-avec-nous/numerique-ethique/numerique-ethique.component';
import {AlimentationComponent} from './components/agir-avec-nous/alimentation/alimentation.component';
import {AgirAuQuotidienComponent} from './components/agir-avec-nous/agir-au-quotidien/agir-au-quotidien.component';
import {RejoindreAssociationComponent} from './components/soutenir/rejoindre-association/rejoindre-association.component';
import {OffrirLaRevueComponent} from './components/soutenir/offrir-la-revue/offrir-la-revue.component';
import {NousFaireConnaitreComponent} from './components/soutenir/nous-faire-connaitre/nous-faire-connaitre.component';
import {FaireUnDonComponent} from './components/faire-un-don/faire-un-don.component';
import {BnsComponent} from './components/agir-avec-nous/bns/bns.component';
import {LegalMentionsComponent} from './components/legal-mentions/legal-mentions.component';
import {ConditionsGeneralesVenteComponent} from './components/conditions-generales-vente/conditions-generales-vente.component';
import {SessionFacilitatorPrivateComponent} from './components/session-facilitator-private/session-facilitator-private.component';

@NgModule({
    declarations: [
        HomepageComponent,
        FrontOfficeComponent,
        LoginComponent,
        HomeBlockComponent,
        SessionsIncomingComponent,
        SessionPageComponent,
        MenuComponent,
        NewsesPageComponent,
        EventsPageComponent,
        DonationComponent,
        EventPageComponent,
        NewsPageComponent,
        CommentListComponent,
        SessionMethodComponent,
        SessionFacilitatorComponent,
        SessionOrganisationComponent,
        SessionSideColumnComponent,
        ConvictionsComponent,
        QuiSommesNousComponent,
        ComiteStatusComponent,
        PartenariatsComponent,
        ContactComponent,
        ProjetComponent,
        PointsDeVenteComponent,
        ActionsComponent,
        CalculerEmpreinteCarboneComponent,
        DesinvestirFossileComponent,
        NumeriqueEthiqueComponent,
        AlimentationComponent,
        AgirAuQuotidienComponent,
        RejoindreAssociationComponent,
        OffrirLaRevueComponent,
        NousFaireConnaitreComponent,
        FaireUnDonComponent,
        BnsComponent,
        AperoDivestComponent,
        LegalMentionsComponent,
        ConditionsGeneralesVenteComponent,
        SessionFacilitatorPrivateComponent,
    ],
    imports: [
        CommonModule,
        FrontOfficeRoutingModule,
        MaterialModule,
        ArtisansModule,
        ProfileModule,
        OrderModule,
        EcoFabSpeedDialModule,
        ShopModule,
    ],
    exports: [FrontOfficeComponent],
})
export class FrontOfficeModule {}

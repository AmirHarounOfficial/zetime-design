import { createBrowserRouter } from 'react-router';
import { HomeScreen } from './components/home-screen';
import { ActivityScreen } from './components/activity-screen';
import { SearchScreen } from './components/search-screen';
import { InboxScreen } from './components/inbox-screen';
import { ProfileScreen } from './components/profile-screen';
import { ConversationScreen } from './components/chat/conversation-screen';
import { HomeServicesModule } from './components/modules/home-services';
import { CarServicesModule } from './components/modules/car-services';
import { StreetAssistantModule } from './components/modules/street-assistant';
import { PropertyRentalModule } from './components/modules/property-rental';
import { RestaurantTablesModule } from './components/modules/restaurant-tables';
import { FoodDeliveryModule } from './components/modules/food-delivery';
import { ParcelDeliveryModule } from './components/modules/parcel-delivery';
import { ServiceListing } from './components/modules/service-listing';
import { ServiceBooking } from './components/modules/service-booking';
import { ServiceConfirmation } from './components/modules/service-confirmation';
import { BookingSuccess } from './components/modules/booking-success';
import { CarTowing } from './components/street-assistant/car-towing';
import { FuelDelivery } from './components/street-assistant/fuel-delivery';
import { CarOpening } from './components/street-assistant/car-opening';
import { BatteryRevive } from './components/street-assistant/battery-revive';
import { TyreFixing } from './components/street-assistant/tyre-fixing';
import { GlobalFixing } from './components/street-assistant/global-fixing';
import { PropertyListing } from './components/property-rental/property-listing';
import { PropertyDetail } from './components/property-rental/property-detail';
import { PropertyBooking } from './components/property-rental/property-booking';
import { RestaurantListing } from './components/restaurant-tables/restaurant-listing';
import { RestaurantDetail } from './components/restaurant-tables/restaurant-detail';
import { RestaurantBooking } from './components/restaurant-tables/restaurant-booking';
import { FoodRestaurantListing } from './components/food-delivery/food-restaurant-listing';
import { RestaurantMenu } from './components/food-delivery/restaurant-menu';
import { FoodCheckout } from './components/food-delivery/checkout';
import { OrderConfirmation } from './components/food-delivery/order-confirmation';
import { FoodDeliveryActivity } from './components/activity/food-delivery-activity';
import { PropertyRentalActivity } from './components/activity/property-rental-activity';
import { ParcelDeliveryActivity } from './components/activity/parcel-delivery-activity';
import { CarServiceActivity } from './components/activity/car-service-activity';
import { RestaurantReservationActivity } from './components/activity/restaurant-reservation-activity';
import { PickupLocation } from './components/parcel-delivery/pickup-location';
import { DeliveryDestinations } from './components/parcel-delivery/delivery-destinations';
import { RouteOptimization } from './components/parcel-delivery/route-optimization';
import { ParcelPayment } from './components/parcel-delivery/payment';
import { ParcelConfirmation } from './components/parcel-delivery/confirmation';
import { DriverSelection } from './components/parcel-delivery/driver-selection';
import { Settings } from './components/profile/settings';
import { PersonalInfo } from './components/profile/personal-info';
import { Notifications } from './components/profile/notifications';
import { PaymentMethods } from './components/profile/payment-methods';
import { Security } from './components/profile/security';
import { Help } from './components/profile/help';
import { NotificationsScreen } from './components/notifications-screen';
import { PromotionsScreen } from './components/promotions-screen';
import { FeaturedServicesScreen } from './components/featured-services-screen';
import { SearchResults } from './components/search-results';
import { Login } from './components/auth/login';
import { SignUp } from './components/auth/signup';
import { ForgotPassword } from './components/auth/forgot-password';
import { OnboardingScreen } from './components/onboarding-screen';
import { BeautyHomeModule } from './components/beauty/beauty-home';
import { BeautyBusinessDetail } from './components/beauty/beauty-business-detail';
import { BeautyProfessionalDetail } from './components/beauty/beauty-professional-detail';
import { BeautyBookingFlow } from './components/beauty/beauty-booking-flow';
import { BeautyQueueView } from './components/beauty/beauty-queue-view';
import { BeautyActivityDetail } from './components/beauty/beauty-activity-detail';
import { BeautySearchResults } from './components/beauty/beauty-search-results';

export const router = createBrowserRouter([
  {
    path: '/module/beauty',
    Component: BeautyHomeModule
  },
  {
    path: '/beauty/search',
    Component: BeautyHomeModule
  },
  {
    path: '/beauty/business/:businessId',
    Component: BeautyBusinessDetail
  },
  {
    path: '/beauty/professional/:professionalId',
    Component: BeautyProfessionalDetail
  },
  {
    path: '/beauty/book/:businessId',
    Component: BeautyBookingFlow
  },
  {
    path: '/beauty/queue/:businessId',
    Component: BeautyQueueView
  },
  {
    path: '/activity/beauty/:bookingId',
    Component: BeautyActivityDetail
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword
  },
  {
    path: '/onboarding',
    Component: OnboardingScreen
  },
  {
    path: '/',
    Component: HomeScreen
  },
  {
    path: '/search',
    Component: SearchScreen
  },
  {
    path: '/activity',
    Component: ActivityScreen
  },
  {
    path: '/inbox',
    Component: InboxScreen
  },
  {
    path: '/chat/:id',
    Component: ConversationScreen
  },
  {
    path: '/profile',
    Component: ProfileScreen
  },
  {
    path: '/module/home-services',
    Component: HomeServicesModule
  },
  {
    path: '/module/car-services',
    Component: CarServicesModule
  },
  {
    path: '/module/street-assistant',
    Component: StreetAssistantModule
  },
  {
    path: '/module/property-rental',
    Component: PropertyListing
  },
  {
    path: '/module/restaurant-tables',
    Component: RestaurantListing
  },
  {
    path: '/module/food-delivery',
    Component: FoodRestaurantListing
  },
  {
    path: '/food-delivery/:restaurantId',
    Component: RestaurantMenu
  },
  {
    path: '/food-delivery/:restaurantId/checkout',
    Component: FoodCheckout
  },
  {
    path: '/food-delivery/:restaurantId/confirmation',
    Component: OrderConfirmation
  },
  {
    path: '/module/parcel-delivery',
    Component: ParcelDeliveryModule
  },
  {
    path: '/module/:module/:categoryId',
    Component: ServiceListing
  },
  {
    path: '/module/:module/:categoryId/:serviceId',
    Component: ServiceBooking
  },
  {
    path: '/module/:module/:categoryId/:serviceId/confirmation',
    Component: ServiceConfirmation
  },
  {
    path: '/module/:module/:categoryId/:serviceId/success',
    Component: BookingSuccess
  },
  {
    path: '/street-assistant/car-towing',
    Component: CarTowing
  },
  {
    path: '/street-assistant/fuel-delivery',
    Component: FuelDelivery
  },
  {
    path: '/street-assistant/car-opening',
    Component: CarOpening
  },
  {
    path: '/street-assistant/battery-revive',
    Component: BatteryRevive
  },
  {
    path: '/street-assistant/tyre-fixing',
    Component: TyreFixing
  },
  {
    path: '/street-assistant/global-fixing',
    Component: GlobalFixing
  },
  {
    path: '/property/:propertyId',
    Component: PropertyDetail
  },
  {
    path: '/property/:propertyId/book',
    Component: PropertyBooking
  },
  {
    path: '/restaurant/:restaurantId',
    Component: RestaurantDetail
  },
  {
    path: '/restaurant/:restaurantId/book',
    Component: RestaurantBooking
  },
  {
    path: '/activity/food-delivery/:orderId',
    Component: FoodDeliveryActivity
  },
  {
    path: '/activity/property-rental/:bookingId',
    Component: PropertyRentalActivity
  },
  {
    path: '/activity/parcel-delivery/:deliveryId',
    Component: ParcelDeliveryActivity
  },
  {
    path: '/activity/car-service/:serviceId',
    Component: CarServiceActivity
  },
  {
    path: '/activity/restaurant-reservation/:reservationId',
    Component: RestaurantReservationActivity
  },
  {
    path: '/notifications',
    Component: NotificationsScreen
  },
  {
    path: '/promotions',
    Component: PromotionsScreen
  },
  {
    path: '/featured-services',
    Component: FeaturedServicesScreen
  },
  {
    path: '/search-results',
    Component: SearchResults
  },
  {
    path: '/parcel-delivery/pickup',
    Component: PickupLocation
  },
  {
    path: '/parcel-delivery/destinations',
    Component: DeliveryDestinations
  },
  {
    path: '/parcel-delivery/select-driver',
    Component: DriverSelection
  },
  {
    path: '/parcel-delivery/route-optimization',
    Component: RouteOptimization
  },
  {
    path: '/parcel-delivery/payment',
    Component: ParcelPayment
  },
  {
    path: '/parcel-delivery/confirmation',
    Component: ParcelConfirmation
  },
  {
    path: '/settings',
    Component: Settings
  },
  {
    path: '/settings/personal-info',
    Component: PersonalInfo
  },
  {
    path: '/settings/notifications',
    Component: Notifications
  },
  {
    path: '/settings/payment-methods',
    Component: PaymentMethods
  },
  {
    path: '/settings/security',
    Component: Security
  },
  {
    path: '/settings/help',
    Component: Help
  },
  {
    path: '/settings/language',
    Component: Settings
  },
  {
    path: '/settings/terms',
    Component: Settings
  },
  {
    path: '/settings/privacy',
    Component: Settings
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/signup',
    Component: SignUp
  }
]);

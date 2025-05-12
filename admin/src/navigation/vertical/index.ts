// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      subject: 'dashboard',
      action: 'manage',
      children: [
        {
          title: 'Analytics',
          path: '/dashboards/analytics',
          subject: 'dashboard',
          action: 'read'
        }
      ]
    },
    {
      sectionTitle: 'Users Management'
    },
    {
      title: 'Client',
      icon: 'tabler:user',
      subject: 'client',
      action: 'manage',
      children: [
        {
          title: 'List',
          path: '/dashboards/user/client/list',
          subject: 'user',
          action: 'read'
        }
      ]
    },
    {
      title: 'Service Providers',
      icon: 'tabler:user-cog',
      subject: 'provider',
      action: 'manage',
      children: [
        {
          title: 'List',
          path: '/dashboards/user/provider/list',
          subject: 'staff',
          action: 'read'
        }
      ]
    },

    // {
    //   sectionTitle: 'Booking Management'
    // },
    // {
    //   title: 'Bookings',
    //   icon: 'tabler:cylinder',
    //   subject: 'bookings',
    //   action: 'manage',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/booking/list',
    //       subject: 'booking',
    //       action: 'read'
    //     }
    //   ]
    // },
    // {
    //   title: 'Invoice',
    //   icon: 'tabler:file-dollar',
    //   subject: 'invoice',
    //   action: 'manage',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/invoice/list',
    //       subject: 'invoice',
    //       action: 'read'
    //     }
    //   ]
    // },
    // {
    //   title: 'Time Sheet',
    //   icon: 'tabler:report',
    //   subject: 'timesheet',
    //   action: 'manage',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/timesheet/list',
    //       subject: 'timesheet',
    //       action: 'read'
    //     }
    //   ]
    // },
    // {
    //   sectionTitle: 'Master Management'
    // },
    // {
    //   title: 'Branch',
    //   icon: 'tabler:brand-codesandbox',
    //   subject: 'branch',
    //   action: 'manage',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/branch/list',
    //       subject: 'branch',
    //       action: 'read'
    //     }
    //   ]
    // },
    // {
    //   title: 'Services',
    //   icon: 'tabler:brand-codesandbox',
    //   subject: 'services',
    //   action: 'manage',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/service/list',
    //       subject: 'service',
    //       action: 'read'
    //     }
    //   ]
    // },
    // {
    //   title: 'Shifting Time',
    //   icon: 'tabler:clock-hour-2',
    //   subject: 'shiftingtime',
    //   action: 'manage',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/shiftTime/list',
    //       subject: 'shiftTime',
    //       action: 'read'
    //     }
    //   ]
    // },
    {
      sectionTitle: 'Project Management'
    },
    {
      title: 'Projects',
      icon: 'tabler:briefcase',
      subject: 'projects',
      action: 'manage',
      children: [
        {
          title: 'List',
          path: '/dashboards/projects/list',
          subject: 'project',
          action: 'manage'
        }
      ]
    },
    {
      title: 'Category',
      icon: 'tabler:category',
      subject: 'category',
      action: 'manage',
      children: [
        {
          title: 'List',
          path: '/dashboards/category/list',
          subject: 'category',
          action: 'manage'
        }
      ]
    },
    {
      sectionTitle: 'Transaction Management'
    },
    {
      title: 'Transaction',
      icon: 'tabler:brand-cashapp',
      path: '/dashboards/transaction/list',
      subject: 'transaction',
      action: 'manage'
    },
    {
      sectionTitle: 'Content Management'
    },
    {
      title: 'Membership',
      icon: 'tabler:ticket',
      path: '/dashboards/membership/list',
      subject: 'membership',
      action: 'manage'
    },

    {
      title: 'CMS',
      icon: 'tabler:clipboard-text',
      path: '/dashboards/cms/list',
      subject: 'cms',
      action: 'manage'
    },
    {
      title: 'FAQs',
      icon: 'tabler:messages',
      path: '/dashboards/faqs/list'
    },
    {
      title: 'QMS',
      icon: 'tabler:brand-google-big-query',
      path: '/dashboards/qms/list',
      subject: 'qms',
      action: 'manage'
    },
    {
      sectionTitle: 'Landing Page CMS Management'
    },
    {
      title: 'Home',
      icon: 'tabler:category',
      subject: 'landing-page-cms-home',
      action: 'manage',
      children: [
        {
          title: 'App Info',
          path: '/dashboards/landing-page-cms/home/app-info/list',
          subject: 'landing-page-cms-home-app-info',
          action: 'manage'
        },
        {
          title: 'App Features',
          path: '/dashboards/landing-page-cms/home/app-features',
          subject: 'landing-page-cms-home-app-feature',
          action: 'manage'
        },
        {
          title: 'How it works',
          path: '/dashboards/landing-page-cms/home/how-it-works',
          subject: 'landing-page-cms-home-how-it-works',
          action: 'manage'
        },
        {
          title: 'Packages',
          path: '/dashboards/landing-page-cms/home/packages',
          subject: 'landing-page-cms-home-packages',
          action: 'manage'
        },
        {
          title: 'Referral',
          path: '/dashboards/landing-page-cms/home/referral',
          subject: 'landing-page-cms-home-referral',
          action: 'manage'
        },
        {
          title: 'Download App',
          path: '/dashboards/landing-page-cms/home/download-app',
          subject: 'landing-page-cms-home-download-app',
          action: 'manage'
        },
      ]
    },
    {
      title: 'About Us',
      icon: 'tabler:category',
      subject: 'landing-page-cms-about-us',
      action: 'manage',
      children: [
        {
          title: 'About Info',
          path: '/dashboards/landing-page-cms/about-us/about-info',
          subject: 'landing-page-cms-aboutus-about-info',
          action: 'manage'
        },
        {
          title: 'Why Trust Us',
          path: '/dashboards/landing-page-cms/about-us/why-trust-us',
          subject: 'landing-page-cms-aboutus-why-trust-us',
          action: 'manage'
        },
      ]
    },
    {
      title: 'Contact Us',
      icon: 'tabler:category',
      subject: 'landing-page-cms-contact-us',
      action: 'manage',
      children: [
        {
          title: 'Contact Info',
          path: '/dashboards/landing-page-cms/contact-us/contact-info',
          subject: 'landing-page-cms-contactus-contact-info',
          action: 'manage'
        },
        {
          title: 'Contact List',
          path: '/dashboards/landing-page-cms/contact-us/contact-form-list',
          subject: 'landing-page-cms-contactus-contact-info',
          action: 'manage'
        },
      ]
    },
    {
      title: 'Terms & Conditions',
      icon: 'tabler:category',
      path: '/dashboards/landing-page-cms/terms',
      subject: 'landing-page-cms-terms',
      action: 'manage',
    },
    {
      title: 'Privacy Policy',
      icon: 'tabler:category',
      path: '/dashboards/landing-page-cms/policy',
      subject: 'landing-page-cms-privacy',
      action: 'manage',
    },
  ]
}

export default navigation
